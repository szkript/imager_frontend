import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GeneralInfo.css';

const GeneralInfo = () => {
  const { customerId } = useParams(); // Dinamikus ügyfél azonosító az URL-ből
  const [generalInfo, setGeneralInfo] = useState(''); // Az input mező állapota
  const [infoText, setInfoText] = useState(''); // Az általános információ megjelenítése
  const [isEditing, setIsEditing] = useState(false); // Szerkesztési mód állapota

  // Az ügyfél általános információinak betöltése az oldal betöltésekor
  useEffect(() => {
    const fetchGeneralInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/${customerId}`);
        setInfoText(res.data.generalInfo || ''); // Beállítja a meglévő általános információkat
      } catch (error) {
        console.error('Error fetching general information', error);
      }
    };

    fetchGeneralInfo();
  }, [customerId]);

  // Az általános információ mentése az adatbázisba
  const handleSaveInfo = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/customers/${customerId}/generalInfo`, {
        generalInfo,
      });
      setInfoText(res.data.generalInfo); // Megjeleníti a frissített információkat
      setGeneralInfo(''); // Kiüríti az input mezőt
      setIsEditing(false); // Kilép a szerkesztési módból
    } catch (error) {
      console.error('Error saving general information', error);
    }
  };

  // Az általános információ törlése az adatbázisból
  const handleDeleteInfo = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${customerId}/generalInfo`);
      setInfoText(''); // Törli az információkat a képernyőről
    } catch (error) {
      console.error('Error deleting general information', error);
    }
  };

  // Szerkesztési mód aktiválása
  const handleEditInfo = () => {
    setGeneralInfo(infoText); // Az aktuális információ megjelenítése a szerkesztési mezőben
    setIsEditing(true); // Átvált szerkesztési módba
  };

  return (
    <div className="general-info-container">
      <h2>General Information</h2>
      {isEditing ? (
        <>
          <textarea
            placeholder="Enter general information about the customer..."
            value={generalInfo}
            onChange={(e) => setGeneralInfo(e.target.value)}
            className="general-info-textarea"
          />
          <button onClick={handleSaveInfo} className="general-info-button">
            Save Information
          </button>
          <button onClick={() => setIsEditing(false)} className="general-info-button">
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="general-info-display">{infoText}</p>
          <button onClick={handleEditInfo} className="general-info-button">
            Edit Information
          </button>
          <button onClick={handleDeleteInfo} className="general-info-button delete">
            Delete Information
          </button>
        </>
      )}
    </div>
  );
};

export default GeneralInfo;
