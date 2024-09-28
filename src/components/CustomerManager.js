import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerManager.css';  // CSS importálása

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers');
        setCustomers(res.data);
      } catch (error) {
        console.error('Error fetching customers', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/customers', { name });
      setCustomers(prevCustomers => [...prevCustomers, res.data]); // Hozzáadjuk az új ügyfelet a meglévő listához
      setName('');
      // Sikeres ügyfél hozzáadás után frissítjük az oldalt
      window.location.reload(); 
    } catch (error) {
      console.error('Error adding customer', error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${customerId}`);
      setCustomers(customers.filter(customer => customer._id !== customerId));
    } catch (error) {
      console.error('Error deleting customer', error);
    }
  };

  return (
    <div className="customer-manager-container">
      <h1>Customer Manager</h1>
      <form onSubmit={handleAddCustomer} className="customer-form">
        <input
          type="text"
          placeholder="Enter customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="customer-input"
        />
        <button type="submit" className="customer-button">
          Add Customer
        </button>
      </form>
      <div className="customer-list">
        {customers.map(customer => (
          <div key={customer._id} className="customer-item">
            <span>{customer.name}</span>
            <button onClick={() => handleDeleteCustomer(customer._id)} className="customer-delete-button">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerManager;
