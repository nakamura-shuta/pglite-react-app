import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { getEmbedding, cosineSimilarity } from './vectorOperations';

export const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    const pglite = await PGlite.create({ extensions: { vector } });
    await pglite.exec(`
      CREATE EXTENSION IF NOT EXISTS vector;
      CREATE TABLE IF NOT EXISTS company_history (
        id SERIAL PRIMARY KEY,
        year INTEGER,
        event TEXT,
        embedding vector(384)
      );
    `);
    console.log('Database initialized successfully');
    return pglite;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const insertCompanyHistory = async (db, history) => {
  await db.exec('DELETE FROM company_history');
  console.log('Existing data deleted');

  for (const item of history) {
    const embedding = getEmbedding(`${item.year}年: ${item.event}`);
    await db.query('INSERT INTO company_history (year, event, embedding) VALUES ($1, $2, $3)', 
                   [item.year, item.event, JSON.stringify(embedding)]);
    console.log(`Added event for year ${item.year}`);
  }
  console.log('Company history data added successfully');
};

export const fetchEvents = async (db) => {
  const result = await db.query('SELECT year, event FROM company_history ORDER BY year');
  return result.rows || [];
};

export const findRelevantEvents = async (db, query) => {
  const queryEmbedding = getEmbedding(query);
  const result = await db.query('SELECT year, event, embedding FROM company_history');
  
  return result.rows
    .map(row => ({
      ...row,
      distance: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding))
    }))
    .sort((a, b) => a.distance - b.distance)
    .filter((event, index) => index < 3 || event.distance < 0.8);
};