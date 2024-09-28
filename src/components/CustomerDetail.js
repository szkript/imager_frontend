import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useParams, Navigate } from 'react-router-dom';
import GeneralInfo from './GeneralInfo'; // Ügyfél általános információk komponens
import CustomerEntries from './CustomerEntries'; // Ügyfél bejegyzések komponens
import './CustomerDetail.css'; // Importáljuk a stílusokat
import axios from 'axios'; // Importáljuk az axios-t az API hívásokhoz

const CustomerDetail = () => {
  const { customerId } = useParams(); // Ügyfél ID megszerzése az útvonalból
  const [customerName, setCustomerName] = useState(''); // Az ügyfél neve állapota
  const [loading, setLoading] = useState(true); // Betöltési állapot
  const [error, setError] = useState(null); // Hibaállapot

  // Az ügyfél nevének lekérdezése az oldal betöltésekor
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/${customerId}`);
        setCustomerName(res.data.name); // Beállítja az ügyfél nevét
        setLoading(false); // Betöltés vége
      } catch (error) {
        console.error('Error fetching customer data', error);
        setError('Failed to load customer data');
        setLoading(false); // Betöltés vége hiba esetén is
      }
    };

    fetchCustomer();
  }, [customerId]);

  // Ha betöltés vagy hiba van, mutassunk visszajelzést
  if (loading) {
    return <p>Loading customer data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="customer-detail-container">
      {/* Ügyfél al-navigációs sáv, mindig megjelenik */}
      <nav className="customer-detail-nav">
        <h3>{customerName}'s Information</h3>
        <ul>
          <li>
            <Link to={`/customer/${customerId}/info`}>General Information</Link>
          </li>
          <li>
            <Link to={`/customer/${customerId}/entries`}>Entries</Link>
          </li>
        </ul>
      </nav>

      {/* Tartalom megjelenítése az al-navigációs sáv alatt */}
      <div className="customer-detail-content">
        <Routes>
          {/* Az alapértelmezett útvonal átirányítása az Entries-re */}
          <Route
            path=""
            element={<Navigate to={`/customer/${customerId}/entries`} replace />}
          />
          {/* Ügyfél általános információk */}
          <Route path="info" element={<GeneralInfo />} />
          {/* Ügyfél bejegyzések */}
          <Route path="entries" element={<CustomerEntries />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomerDetail;
