import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getProperty = async (req, res) => {
    try {
        // 🔹 Support ZIP from query or body
        const zip = req.query.zip || req.body?.zip || "90210";
        console.log("Fetching property details for ZIP:", zip);

        let searchResults = [];

        // 🔹 STEP 1: Search properties (RapidAPI → fallback RentCast)
        try {
            const rapidResponse = await axios.get(
                "https://realty-mole-property-api.p.rapidapi.com/properties",
                {
                    params: { postalCode: zip, limit: 5 },
                    headers: {
                        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                        "x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com",
                    },
                }
            );
            searchResults = rapidResponse.data;
            console.log("Search success (RapidAPI):", searchResults.length);
        } catch (err) {
            console.log("RapidAPI failed, trying fallback (RentCast)...");
            const rentcastResponse = await axios.get(
                "https://api.rentcast.io/v1/properties",
                {
                    params: { zipCode: zip, limit: 5 },
                    headers: { "X-Api-Key": process.env.RENTCAST_API_KEY },
                }
            );
            searchResults = rentcastResponse.data;
            console.log("Search success (RentCast):", searchResults.length);
        }

        if (!searchResults || !searchResults.length) {
            return res.status(404).json({ success: false, message: "No properties found" });
        }

        // 🔹 STEP 2: Fetch Enriched Details (Singular calls for each property)
        console.log("Fetching enriched details via PropertyDetail singular endpoint (POST)...");

        const detailPromises = searchResults.map(async (item) => {
            // Prefer clean addresses for searching
            const searchAddress = item.formattedAddress || `${item.addressLine1}, ${item.city}, ${item.state}`;

            try {
                // RealEstateAPI v2 PropertyDetail expects a POST with { address: "..." }
                const detailRes = await axios.post(
                    "https://api.realestateapi.com/v2/PropertyDetail",
                    { address: searchAddress },
                    {
                        headers: {
                            "x-api-key": process.env.REALESTATE_API_KEY,
                            "Content-Type": "application/json"
                        },
                    }
                );

                const p = detailRes.data?.data;
                if (!p) throw new Error("No details returned");
                return p
                // return {
                //     id: p.id,
                //     address: p.formattedAddress,
                //     city: p.city,
                //     state: p.state,
                //     zip: p.zipCode,
                //     details: {
                //         propertyType: p.propertyType,
                //         bedrooms: p.bedrooms,
                //         bathrooms: p.bathrooms,
                //         squareFootage: p.squareFootage,
                //         yearBuilt: p.yearBuilt,
                //         lotSize: p.lotSize,
                //     },
                //     lotInfo: p.lotInfo,
                //     ownerInfo: p.ownerInfo,
                //     lastSale: p.lastSale || {},
                //     owner: p.owner || {},
                //     taxAssessments: p.taxAssessments || {},
                // };
            } catch (err) {
                console.error(`- Failed for ${searchAddress}:`, err.response?.data?.message || err.message);
                // Fallback to basic search result data if detail lookup fails
                return {
                    id: item.id || item.property_id,
                    address: item.formattedAddress || `${item.addressLine1}, ${item.city}, ${item.state}`,
                    city: item.city,
                    state: item.state,
                    zip: item.zipCode,
                    isPartial: true,
                    message: "Detailed data currently unavailable"
                };
            }
        });

        const finalResults = await Promise.all(detailPromises);

        // 🔹 Final response
        res.json({
            success: true,
            count: finalResults.length,
            properties: finalResults,
        });

    } catch (error) {
        console.error("FINAL ERROR:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });
    }
};

export { getProperty };