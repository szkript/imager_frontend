import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GeneralInfo.css';

const GeneralInfo = () => {
  const { customerId } = useParams();
  const [generalInfo, setGeneralInfo] = useState('');
  const [infoText, setInfoText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const predefinedCategories = [
    'Contact Info',
    'Business Details',
    'Payment Info',
    'Important Notes',
    'Project Details',
    'Meeting Notes'
  ];

  useEffect(() => {
    const fetchGeneralInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/${customerId}`);
        setInfoText(res.data.generalInfo || '');
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error('Error fetching general information', error);
      }
    };

    fetchGeneralInfo();
  }, [customerId]);

  const handleSaveInfo = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/customers/${customerId}/generalInfo`, {
        generalInfo,
        category: selectedCategory
      });
      setInfoText(res.data.generalInfo);
      setCategories([...categories, { text: generalInfo, category: selectedCategory }]);
      setGeneralInfo('');
      setSelectedCategory('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving general information', error);
    }
  };

  const handleDeleteInfo = async (categoryToDelete) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${customerId}/generalInfo/${categoryToDelete}`);
      setCategories(categories.filter(cat => cat.category !== categoryToDelete));
    } catch (error) {
      console.error('Error deleting general information', error);
    }
  };

  const handleEditInfo = (category) => {
    const categoryInfo = categories.find(cat => cat.category === category);
    if (categoryInfo) {
      setGeneralInfo(categoryInfo.text);
      setSelectedCategory(category);
      setIsEditing(true);
    }
  };

  return (
    <div className="general-info-container">
      <h2>General Information</h2>
      
      {isEditing ? (
        <div className="edit-section">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Select Category</option>
            {predefinedCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            placeholder="Enter information..."
            value={generalInfo}
            onChange={(e) => setGeneralInfo(e.target.value)}
            className="general-info-textarea"
          />
          <div className="button-group">
            <button 
              onClick={handleSaveInfo} 
              className="general-info-button"
              disabled={!selectedCategory}
            >
              Save Information
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              className="general-info-button"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="info-display">
          <button 
            onClick={() => setIsEditing(true)} 
            className="general-info-button add-new"
          >
            Add New Information
          </button>
          
          {categories.map((info, index) => (
            <div key={index} className="category-section">
              <h3>{info.category}</h3>
              <p className="general-info-display">{info.text}</p>
              <div className="button-group">
                <button 
                  onClick={() => handleEditInfo(info.category)} 
                  className="general-info-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteInfo(info.category)} 
                  className="general-info-button delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneralInfo;