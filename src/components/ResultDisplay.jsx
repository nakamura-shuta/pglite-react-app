import React from 'react';

function ResultDisplay({ result }) {
  return (
    <div>
      <h2>検索結果</h2>
      <pre>{result}</pre>
    </div>
  );
}

export default ResultDisplay;