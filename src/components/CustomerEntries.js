import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CustomerEntries.css';
import ImageModal from './ImageModal';
import mammoth from 'mammoth'; // Word fájlokhoz
import * as XLSX from 'xlsx';  // Excel fájlokhoz

const CustomerEntries = () => {
  const { customerId } = useParams();
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [fileBase64, setFileBase64] = useState(''); // Új state a fájlokhoz
  const [fileName, setFileName] = useState(''); // Fájlnév állapot
  const [fileContent, setFileContent] = useState(''); // Fájltartalom modálhoz
  const [customerName, setCustomerName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [latestTopic, setLatestTopic] = useState('');

  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editText, setEditText] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchEntriesAndCustomer = async () => {
      try {
        const entriesRes = await axios.get(`http://localhost:5000/api/entries/customer/${customerId}`);
        setEntries(entriesRes.data);

        const customerRes = await axios.get(`http://localhost:5000/api/customers/${customerId}`);
        setCustomerName(customerRes.data.name);

        const topicsRes = await axios.get(`http://localhost:5000/api/entries/topics/customer/${customerId}`);
        setTopics(topicsRes.data);
        if (topicsRes.data.length > 0) {
          setLatestTopic(topicsRes.data[0].name);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchEntriesAndCustomer();
  }, [customerId]);

  const handleEditEntry = async (entryId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/entries/${entryId}`, {
        text: editText
      });
      
      setEntries(entries.map(entry => 
        entry._id === entryId ? {...entry, text: editText} : entry
      ));
      
      setEditingEntryId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleTopicChange = (e) => {
    const value = e.target.value;
    setNewTopic(value);

    if (value.trim() !== '') {
      const filtered = topics.filter((topic) =>
        topic.name.toLowerCase().includes(value.toLowerCase())
      );    
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEntry(e);
    }

    if (e.key === 'Tab' && filteredTopics.length > 0) {
      e.preventDefault();
      setNewTopic(filteredTopics[0].name);
      setFilteredTopics([]);
    }

    if (e.key === 'Escape') {
      setFilteredTopics([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setFilteredTopics([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);

  const handleShowAllTopics = () => {
    setFilteredTopics(topics);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setFileBase64(event.target.result);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
  
    const topicName = newTopic || latestTopic;
  
    if (!topicName) {
      alert('Please enter a topic or use the suggested one.');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:5000/api/entries', {
        customer: customerId,
        imageBase64,
        fileBase64,
        fileName,
        text,
        topicName,
      });
  
      setEntries([res.data, ...entries]);
  
      if (newTopic) {
        setLatestTopic(newTopic);
      }
  
      setText('');
      setImageBase64('');
      setFileBase64('');
      setFileName('');
      setNewTopic('');
      setFilteredTopics([]);
    } catch (error) {
      console.error('Error adding entry', error);
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

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage('');
    setFileContent(''); // Fájltartalom resetelése
    setModalOpen(false);
  };

  const openFileModal = async (entry) => {
    const fileType = entry.fileName.split('.').pop();
    let content = '';
  
    try {
      if (fileType === 'docx') {
        // Mammoth.js használata a Word fájl konvertálásához
        const result = await mammoth.convertToHtml({ arrayBuffer: base64ToArrayBuffer(entry.fileBase64) });
        content = result.value;  // HTML formátumban kapjuk vissza a fájl tartalmát
      } else if (fileType === 'xlsx') {
        // SheetJS használata Excel fájl konvertálásához
        const workbook = XLSX.read(base64ToArrayBuffer(entry.fileBase64), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        content = XLSX.utils.sheet_to_html(sheet);  // HTML formátumba konvertáljuk az Excel sheetet
      }
  
      // A fájl tartalom megjelenítése a modalban
      setFileContent(content);
      setModalOpen(true);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };
  
  // Base64 konverzió segédfüggvény
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64.split(',')[1]);  // Base64 dekódolása
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;  // Visszaadja a fájl tartalmát ArrayBuffer formátumban
  };
  

  return (
    <div className="customer-entries-container">
      <h1 className="entry-header">{customerName}'s Entries</h1>
      <form onSubmit={handleAddEntry} className="entry-form">
        <div className="entry-actions">
          <button type="submit" className="entry-button">
            Add Entry
          </button>
  
          <div className="topic-autocomplete" ref={inputRef}>
            <input
              type="text"
              placeholder={latestTopic ? `Latest Topic: ${latestTopic}` : 'Enter a topic'}
              value={newTopic}
              onChange={handleTopicChange}
              onKeyDown={handleKeyDown}
              className="topic-input"
            />
            <div className="show-all-topics-icon" onClick={handleShowAllTopics}>

              □
            </div>
  
            {filteredTopics.length > 0 && (
              <ul className="topic-suggestions">
                {filteredTopics.map((topic) => (
                  <li key={topic._id} onClick={() => setNewTopic(topic.name)}>
                    {topic.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
  
        <textarea
          placeholder="Write something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handleImagePaste}
          className="entry-textarea"
        />
  
        <input type="file" accept=".docx,.xlsx" onChange={handleFileChange} />
  
        {imageBase64 && (
          <div className="entry-image-preview">
            <img src={imageBase64} alt="Pasted" />
          </div>
        )}
      </form>
  
      <div style={{ marginTop: '20px' }}>
        {entries.map((entry) => (
          <div key={entry._id} className="entry-item">
            {entry.imageBase64 && (
              <img
                src={entry.imageBase64}
                alt="Entry"
                className="entry-image-preview"
                onClick={() => openModal(entry.imageBase64)}
              />
            )}

            {editingEntryId === entry._id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="entry-textarea"
                />
                <button onClick={() => handleEditEntry(entry._id)}>Save</button>
                <button onClick={() => {
                  setEditingEntryId(null);
                  setEditText('');
                }}>Cancel</button>
              </div>
            ) : (
              <>
                <p className="entry-text">{entry.text}</p>
                <button onClick={() => {
                  setEditingEntryId(entry._id);
                  setEditText(entry.text);
                }}>Edit</button>
              </>
            )}
            <p className="entry-timestamp">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
            <p>Topic: {entry.topic ? entry.topic.name : 'No topic assigned'}</p>
            {entry.fileBase64 && (
              <button onClick={() => openFileModal(entry)}>
                View {entry.fileName}
              </button>
            )}
          </div>
        ))}
      </div>
  
      {modalOpen && (
        <>
          {/* Sötét háttér a modál mögött */}
          <div className="modal-overlay" onClick={closeModal}></div>
  
          {/* Modál tartalom */}
          <div className="file-modal">
            {selectedImage && <img src={selectedImage} alt="Full Size" />}
            {fileContent && <div dangerouslySetInnerHTML={{ __html: fileContent }} />}
            <button onClick={closeModal}>Close</button>
          </div>
        </>
      )}
    </div>
  );  

};
export default CustomerEntries;
