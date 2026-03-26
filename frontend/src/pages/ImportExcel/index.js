import React, { useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";

function ImportExcel() {
    const [rows, setRows] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Optional validation
        const fileExtension = file.name.split(".").pop();
        if (fileExtension !== "xlsx" && fileExtension !== "xls") {
            alert("Please upload a valid Excel file");
            return;
        }

        ExcelRenderer(file, (err, resp) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log("resp.rows====", resp.rows);

            // Skip header row (index 0)
            const data = resp.rows
                .slice(4) // ❗ skip header
                .filter((row) => row && row.length > 0) // remove empty rows
                .map((row) => ({
                    microRegionKey: row[0] ? String(row[0]).trim() : "",
                    finalRci: row[10] ? String(row[10]).trim() : "",
                }));

            console.log("data====", data);

            setRows(data);
        });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Upload Excel File</h2>

            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
            />

            <br /><br />

            {rows.length > 0 && (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Micro Region Key</th>
                            <th>Final Rci</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <th>{rowIndex + 1}</th>
                                <td>{row.microRegionKey}</td>
                                <td>{row.finalRci}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ImportExcel;