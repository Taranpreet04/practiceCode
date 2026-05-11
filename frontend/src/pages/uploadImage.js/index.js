
import React, { useState } from 'react';
import axios from "axios";
import { Radio, Tabs } from 'antd';


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

  const [mode, setMode] = useState('top');

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };


  return (
    <div >
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
      {/* <div className='tab-div'>
        <Radio.Group onChange={handleModeChange} value={mode} >
          <Radio.Button value="top">Horizontal</Radio.Button>
          <Radio.Button value="left">Vertical</Radio.Button>
        </Radio.Group>
        <Tabs
          defaultActiveKey="1"
          tabPlacement={mode}
          style={{ height: 'calc(100vh - 220px)' }}
          items={Array.from({ length: 30 }, (_, i) => {
            const id = String(i);
            return {
              label: `Tab-${id}`,
              key: id,
              disabled: i === 28,
              children: `Content of tab ${id}`,
            };
          })}
        />
      </div> */}
    </div>


  );
};

export default ImageUpload;
