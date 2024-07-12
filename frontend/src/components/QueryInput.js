import React from 'react';

const QueryInput = ({ query, onQueryChange, onSubmit }) => {
  return (
    <div>
      <h2>Enter Your Query</h2>
      <textarea
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        rows={5}
        cols={50}
        placeholder="Enter your natural language query here..."
      />
      <br />
      <button onClick={onSubmit}>Submit Query</button>
    </div>
  );
};

export default QueryInput;