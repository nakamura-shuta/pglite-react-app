// src/services/databaseOperations.js
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { getEmbeddingVectorString } from './vectorOperations';

/**
 * DBを初期化 (テーブル作成 + pgvector拡張)
 */
export const initDatabase = async () => {
  try {
    console.log('Initializing database with pgvector...');
    const pglite = await PGlite.create({ extensions: { vector } });
    await pglite.exec(`
      CREATE EXTENSION IF NOT EXISTS vector;

      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY,
        content TEXT,
        embedding vector(768)
      );
    `);
    console.log('Database initialized successfully');
    return pglite;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * 全データ削除→挿入 (架空データ)
 */
export const insertDocuments = async (db, docs) => {
  await db.exec('DELETE FROM documents'); // 全削除
  console.log('Existing data deleted');

  for (const doc of docs) {
    // テキスト → 埋め込み → pgvector 文字列
    const embeddingLiteral = getEmbeddingVectorString(doc.content, 768);

    // シングルクォートをエスケープ
    const safeContent = doc.content.replace(/'/g, "''");

    const sql = `
      INSERT INTO documents (id, content, embedding)
      VALUES (
        ${doc.id},
        '${safeContent}',
        ${embeddingLiteral}
      );
    `;
    await db.exec(sql);
    console.log(`Inserted doc ID=${doc.id}`);
  }
  console.log('All documents inserted successfully');
};

/**
 * 全レコードを取得 (一覧表示用)
 */
export const fetchDocuments = async (db) => {
  const result = await db.query('SELECT id, content FROM documents ORDER BY id');
  return result.rows || [];
};

/**
 * ユーザのクエリを埋め込み化して <-> で類似度検索
 */
export const findRelevantDocuments = async (db, query) => {
  const embeddingLiteral = getEmbeddingVectorString(query, 768);
  const sql = `
    SELECT
      id,
      content,
      embedding <-> ${embeddingLiteral} AS distance
    FROM documents
    ORDER BY embedding <-> ${embeddingLiteral}
    LIMIT 3;
  `;
  const result = await db.query(sql);
  return result.rows || [];
};