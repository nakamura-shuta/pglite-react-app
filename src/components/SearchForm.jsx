import React, { useState } from 'react';
import { findRelevantEvents } from '../services/databaseOperations';
import { getAIResponse } from '../services/aiOperations';

function SearchForm({ db, setResult, setIsLoading }) {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSearch = async () => {
    if (!db || !query || !apiKey) {
      alert('Database, query, or API key not set');
      return;
    }
    setIsLoading(true);
    try {
      const relevantEvents = await findRelevantEvents(db, query);
      if (relevantEvents.length > 0) {
        const response = await getAIResponse(apiKey, query, relevantEvents);
        setResult(response);
      } else {
        setResult('関連する出来事が見つかりませんでした。');
      }
    } catch (error) {
      console.error('Error finding events:', error);
      setResult('エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="input-group">
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Anthropic APIキーを入力"
      />
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="質問を入力（例：2015年に何がありましたか？）"
      />
      <button className="search-button" onClick={handleSearch}>検索</button>
    </div>
  );
}

export default SearchForm;