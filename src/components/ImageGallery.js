import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageGallery.css';  // CSS importálása

const ImageGallery = ({ customerId }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/images/customer/${customerId}`);
        setImages(res.data);
      } catch (error) {
        console.error('Error fetching images', error);
      }
    };

    fetchImages();
  }, [customerId]);

  return (
    <div className="image-gallery-container">
      <h2>Image Gallery</h2>
      <div className="image-list">
        {images.map(image => (
          <div key={image._id} className="image-item">
            <img src={image.url} alt="Customer" className="gallery-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;