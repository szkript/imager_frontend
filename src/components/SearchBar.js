import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/customers/search?q=${searchTerm}`
        );

        // Eredmények rendezése típus szerint
        const sortedResults = res.data.sort((a, b) => {
          if (a.matchType === "customer") return -1;
          if (b.matchType === "customer") return 1;
          if (a.matchType === "topic") return -1;
          if (b.matchType === "topic") return 1;
          return 0;
        });

        setCustomers(sortedResults);
      } catch (error) {
        console.error("Error fetching customers and entries", error);
      }
    };

    if (searchTerm) {
      fetchCustomers();
    } else {
      setCustomers([]);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getResultLabel = (customer) => {
    switch (customer.matchType) {
      case "customer":
        return `${customer.name} (Customer)`;
      case "topic":
        return `${customer.name} (Topic: ${customer.topic})`;
      case "entries":
        return `${customer.name} (${customer.entries.length} entries)`;
      default:
        return customer.name;
    }
  };

  const handleSelectCustomer = (customer) => {
    switch (customer.matchType) {
      case "customer":
        navigate(`/customer/${customer._id}/info`);
        break;
      case "topic":
        navigate(
          `/customer/${customer._id}/entries`
        ); /*ide csak megint az entriesre kell irányítani. */
        break;
      case "entries":
        navigate(`/customer/${customer._id}/entries`);
        break;
      default:
        console.error("Unknown matchType:", customer.matchType);
    }
    setSearchTerm("");
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name, entries, or topics..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyPress={(e) => {
          if (e.key === "Enter" && customers.length > 0) {
            handleSelectCustomer(customers[0]);
          }
        }}
      />
      {searchTerm && customers.length > 0 && (
        <ul className="search-dropdown">
          {customers.map((customer) => (
            <li
              key={customer._id}
              onClick={() => handleSelectCustomer(customer)}
              className={`search-result ${customer.matchType}`}
            >
              {getResultLabel(customer)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
