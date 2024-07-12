import React from 'react';

const DatabaseSelector = ({ databases, selectedDatabase, onDatabaseChange }) => {
  return (
    <div>
      <h2>Select Database</h2>
      <select value={selectedDatabase} onChange={(e) => onDatabaseChange(e.target.value)}>
        <option value="">Select a database</option>
        {databases.map((db) => (
          <option key={db} value={db}>
            {db}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatabaseSelector;