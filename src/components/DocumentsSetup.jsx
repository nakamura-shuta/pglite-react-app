import React, { useState, useEffect } from 'react';
import { insertDocuments, fetchDocuments } from '../services/databaseOperations';
import { DOCUMENTS } from '../utils/constants';

function DocumentsSetup({ db, setIsLoading }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (db) {
      loadData();
    }
  }, [db]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const fetched = await fetchDocuments(db);
      setItems(fetched);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupData = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      await insertDocuments(db, DOCUMENTS);
      await loadData();
    } catch (error) {
      console.error('Error setting up documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button className="setup-button" onClick={setupData}>
        データベースセットアップ / リセット
      </button>
      <h2>惑星データ一覧 (フィクション)</h2>
      {items.length > 0 ? (
        <ul>
          {items.map((doc) => (
            <li key={doc.id}>
              <b>ID: {doc.id}</b> - {doc.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>データがありません。セットアップを実行してください。</p>
      )}
    </div>
  );
}

export default DocumentsSetup;