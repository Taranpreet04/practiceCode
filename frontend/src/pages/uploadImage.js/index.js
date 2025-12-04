import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // preview
    setPreview(URL.createObjectURL(file));
  };

  // send to backend
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image); // MUST match Multer field name

    try {
      const response = await axios.post(
        "http://localhost:7000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Uploaded:", response.data);
      alert("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Image</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          width="150"
          style={{ marginTop: 10, borderRadius: 8 }}
        />
      )}

      <br /><br />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUpload;
