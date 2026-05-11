import { useEffect, useState } from "react";
import axios from "axios";
import "./Property.css";

const Property = () => {
    const [properties, setProperties] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.post("http://localhost:7000/api/property/get-property-details");
                setProperties(res.data?.properties || []);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Helper to format currency
    const formatCurrency = (val) => {
        if (!val) return "N/A";
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const placeholderImg = "/house.png"; // Simple public path

    return (
        <div className="property-page">
            <div className="property-container">
                <header className="property-header">
                    <h1>Luxury Properties</h1>
                    <p>Discover premium real estate listings in your targeted area</p>
                </header>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                        <p>Curating exclusive listings...</p>
                    </div>
                ) : (
                    <div className="accordion-list">
                        {properties.map((property, index) => {
                            const info = property?.propertyInfo;
                            const address = info?.address;
                            const tax = property?.taxData?.tax?.[0]; // Get the latest tax record if exists

                            return (
                                <div
                                    className={`property-card ${activeIndex === index ? 'active' : ''}`}
                                    key={index}
                                >
                                    <div className="card-header" onClick={() => toggleAccordion(index)}>
                                        <img
                                            src={placeholderImg}
                                            alt="Property"
                                            className="house-thumb"
                                        />
                                        <div className="property-summary">
                                            <h3>{address?.address || "Address Unavailable"}</h3>
                                            <p className="location">{address?.city}, {address?.state} {address?.zip}</p>
                                            <div className="basic-specs">
                                                <span>{info?.bedrooms || 0} Beds</span>
                                                <span>•</span>
                                                <span>{info?.bathrooms || 0} Baths</span>
                                                <span>•</span>
                                                <span>{(info?.livingSquareFeet || 0).toLocaleString()} SqFt</span>
                                            </div>
                                        </div>
                                        <div className="expand-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>

                                    <div className="card-content" style={{ maxHeight: activeIndex === index ? '800px' : '0' }}>
                                        <div className="details-grid">
                                            <div className="detail-section">
                                                <h4>Structure Info</h4>
                                                <div className="detail-item">
                                                    <span className="detail-label">Property Type</span>
                                                    <span className="detail-value">{property?.lotInfo?.propertyType || "N/A"}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Year Built</span>
                                                    <span className="detail-value">{info?.yearBuilt || "N/A"}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Stories</span>
                                                    <span className="detail-value">{info?.stories || "N/A"}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Total Rooms</span>
                                                    <span className="detail-value">{info?.totalRooms || "N/A"}</span>
                                                </div>
                                            </div>

                                            <div className="detail-section">
                                                <h4>Lot & Area</h4>
                                                <div className="detail-item">
                                                    <span className="detail-label">Lot SqFt</span>
                                                    <span className="detail-value">{(info?.lotSquareFeet || 0).toLocaleString()}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Zoning</span>
                                                    <span className="detail-value">{property?.lotInfo?.zoning || "N/A"}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">County</span>
                                                    <span className="detail-value">{property?.lotInfo?.county || "N/A"}</span>
                                                </div>
                                            </div>

                                            <div className="detail-section">
                                                <h4>Financials</h4>
                                                <div className="detail-item">
                                                    <span className="detail-label">Assessed Value</span>
                                                    <span className="detail-value">{formatCurrency(tax?.assessedValue)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Market Value</span>
                                                    <span className="detail-value">{formatCurrency(tax?.marketValue)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Tax Amount</span>
                                                    <span className="detail-value">{formatCurrency(tax?.taxAmount)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Tax Year</span>
                                                    <span className="detail-value">{tax?.taxYear || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Property;