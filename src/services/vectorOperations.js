export const getEmbedding = (text, dimensions = 384) => {
    console.log('Generating embedding for:', text);
    const words = text.toLowerCase().split(/\W+/);
    const vector = new Array(dimensions).fill(0);
    
    words.forEach((word, index) => {
      for (let i = 0; i < word.length; i++) {
        const charCode = word.charCodeAt(i);
        const position = (charCode + index) % dimensions;
        vector[position] += 1;
      }
    });
    
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
  };
  
  export const cosineSimilarity = (vec1, vec2) => {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return 1 - (dotProduct / (magnitude1 * magnitude2));
  };