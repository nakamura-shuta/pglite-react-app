import React, { useState } from 'react';
import { findRelevantDocuments } from '../services/databaseOperations';
import { getAIResponse } from '../services/aiOperations';

function SearchForm({ db, setResult, setIsLoading }) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!db || !query) {
      alert('Database or query not set');
      return;
    }
    setIsLoading(true);

    try {
      // 1. 埋め込み類似度で文書を検索
      const relevantDocs = await findRelevantDocuments(db, query);

      // 2. 得られたドキュメントをLLMに渡す
      if (relevantDocs.length > 0) {
        const response = await getAIResponse(query, relevantDocs);
        setResult(response);
      } else {
        setResult('関連するデータが見つかりませんでした。');
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      setResult('エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="input-group">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="質問を入力（例：Grimlorは住める星？）"
      />
      <button className="search-button" onClick={handleSearch}>検索</button>
    </div>
  );
}

export default SearchForm;