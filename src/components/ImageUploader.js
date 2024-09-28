import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';  // CSS importálása

const ImageUploader = ({ customerId }) => {
  const [imageBase64, setImageBase64] = useState('');
  const [text, setText] = useState('');

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/images', {
        customer: customerId,
        imageBase64,
        text,
      });
      setImageBase64('');
      setText('');
    } catch (error) {
      console.error('Error adding image', error);
    }
  };

  const handleImagePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = function (event) {
          setImageBase64(event.target.result);
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  return (
    <div className="image-uploader-container">
      <h2>Upload Image</h2>
      <form onSubmit={handleAddImage} className="image-form">
        <textarea
          placeholder="Write something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={handleImagePaste}
          className="image-textarea"
        />
        {imageBase64 && (
          <div className="image-preview">
            <img src={imageBase64} alt="Preview" />
          </div>
        )}
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
    </div>
  );
};

export default ImageUploader;
