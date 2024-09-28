import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerManager from './components/CustomerManager';
import CustomerSearch from './components/CustomerSearch';
import CustomerDetail from './components/CustomerDetail'; // Importáljuk a CustomerDetail komponenst
import SearchBar from './components/SearchBar'; // Importáljuk a SearchBar komponenst
import './App.css';  // CSS importálása

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="main-nav">
          <ul style={{ display: 'flex', alignItems: 'center', gap: '10px', listStyle: 'none' }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/customers">Customer Manager</Link>
            </li>
            <li style={{ flexGrow: 1 }}> {/* A SearchBar helyének fenntartása */}
              <SearchBar /> {/* Keresősáv a navigációs sáv részeként */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<CustomerSearch />} />
          <Route path="/customers" element={<CustomerManager />} />
          <Route path="/customer/:customerId/*" element={<CustomerDetail />} /> {/* Ügyfél aloldalainak kezelése */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
