import React, { useState, useEffect } from 'react';
import { insertCompanyHistory, fetchEvents } from '../services/databaseOperations';
import { COMPANY_HISTORY } from '../utils/constants';

function CompanyHistory({ db, setIsLoading }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (db) {
      loadEvents();
    }
  }, [db]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const fetchedEvents = await fetchEvents(db);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupCompanyHistory = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      await insertCompanyHistory(db, COMPANY_HISTORY);
      await loadEvents();
    } catch (error) {
      console.error('Error setting up company history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="button-group">
        <button className="setup-button" onClick={setupCompanyHistory}>
          データベースセットアップ / リセット
        </button>
      </div>
      <h2>会社の歴史</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.year}>{event.year}年: {event.event}</li>
          ))}
        </ul>
      ) : (
        <p>イベントがありません。セットアップを実行してください。</p>
      )}
    </div>
  );
}

export default CompanyHistory;