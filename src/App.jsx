import React, { useState, useEffect } from 'react';
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import CompanyHistory from './components/CompanyHistory';
import SearchForm from './components/SearchForm';
import ResultDisplay from './components/ResultDisplay';
import { initDatabase } from './services/databaseOperations';
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
      <h1>会社の歴史 - RAGデモ</h1>
      <CompanyHistory db={db} setIsLoading={setIsLoading} />
      <SearchForm db={db} setResult={setResult} setIsLoading={setIsLoading} />
      <ResultDisplay result={result} />
      {isLoading && <div className="loader">処理中...</div>}
    </div>
  );
}

export default App;