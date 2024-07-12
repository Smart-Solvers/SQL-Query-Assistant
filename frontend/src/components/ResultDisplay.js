import React from 'react';

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="result-display">
      <h2>Query Result</h2>
      <h3>Generated SQL Query:</h3>
      <pre>{result.sql_query}</pre>
      <h3>Result:</h3>
      {result.response.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(result.response[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.response.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ResultDisplay;