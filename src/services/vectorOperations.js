// src/services/vectorOperations.js

function getEmbedding(text, dimensions) {
  const words = text.toLowerCase().split(/\W+/);
  const vector = new Array(dimensions).fill(0);

  words.forEach((word, index) => {
    for (let i = 0; i < word.length; i++) {
      const charCode = word.charCodeAt(i);
      const pos = (charCode + index) % dimensions;
      vector[pos] += 1;
    }
  });

  // 正規化（単純）
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => (magnitude > 0 ? val / magnitude : 0));
}

/**
 * pgvector形式の文字列
 * ex: '[0.0123,0.4567,...]'::vector(768)
 */
export function getEmbeddingVectorString(text, dimensions) {
  const vec = getEmbedding(text, dimensions);
  const embeddingStr = vec.map(v => v.toFixed(4)).join(',');
  return `'[${embeddingStr}]'::vector(${dimensions})`;
}