// src/App.jsx
import React, { useState, useEffect } from 'react';
import { initDatabase } from './services/databaseOperations';
import DocumentsSetup from './components/DocumentsSetup';
import SearchForm from './components/SearchForm';
import ResultDisplay from './components/ResultDisplay';
import './styles/App.css';

function App() {
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    initDatabase().then(setDb);
  }, []);

  return (
    <div className="container">
      <h1>フィクションRAGデモ - pgvector + Gemini nano</h1>
      <DocumentsSetup db={db} setIsLoading={setIsLoading} />
      <SearchForm db={db} setResult={setResult} setIsLoading={setIsLoading} />
      <ResultDisplay result={result} />
      {isLoading && <div className="loader">処理中...</div>}
    </div>
  );
}

export default App;