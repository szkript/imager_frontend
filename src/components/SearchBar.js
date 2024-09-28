import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Ha van keresési kifejezés, keresünk az ügyfél nevében és a bejegyzéseikben is
        const res = await axios.get(`http://localhost:5000/api/customers/search?q=${searchTerm}`);
        setCustomers(res.data); // A keresési eredmények beállítása
      } catch (error) {
        console.error('Error fetching customers and entries', error);
      }
    };

    if (searchTerm) {
      fetchCustomers(); // Csak akkor hívjuk meg, ha van keresési feltétel
    } else {
      setCustomers([]); // Ha nincs keresési kifejezés, üresítjük a listát
    }
  }, [searchTerm]); // A keresési kifejezés változására újra lefut

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCustomer = (customerId) => {
    navigate(`/customer/${customerId}/entries`);
    setSearchTerm(''); // Keresési mező kiürítése
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search customers or entries..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            const bestMatch = customers[0];
            if (bestMatch) {
              handleSelectCustomer(bestMatch._id);
            }
          }
        }}
      />
      {searchTerm && customers.length > 0 && (
        <ul className="search-dropdown">
          {customers.map((customer) => (
            <li
              key={customer._id}
              onClick={() => handleSelectCustomer(customer._id)}
            >
              {customer.name} ({customer.entries.length} matching entries)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
