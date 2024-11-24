import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerSearch.css';

const CustomerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCustomer = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Kiválasztjuk az első találatot, ha van
      const bestMatch = filteredCustomers[0];
      if (bestMatch) {
        handleSelectCustomer(bestMatch._id);
      }
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ul>
        {filteredCustomers.map((customer) => (
          <li key={customer._id} onClick={() => handleSelectCustomer(customer._id)}>
            {customer.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerSearch;