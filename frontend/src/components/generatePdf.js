import React from 'react'
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const GeneratePdf = () => {
    const downloadPDF = () => {
        const input = document.getElementById("pdf-content");
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            console.log("imgData==", imgData)
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");
        });
    };
    return (
        <div>
            <div id="pdf-content" style={{ padding: 20, background: "#eee" }}>
                <h1>Hello PDF</h1>
                <p>This will be captured into the PDF.</p>
                <img
                    src="/logo192.png"
                    alt="logo"
                    width={100}
                    crossOrigin="anonymous" // ✅ Needed for CORS
                />
            </div>
            <button onClick={downloadPDF}>Click to generate pdf</button>
        </div>
    )
}
export default GeneratePdf;


