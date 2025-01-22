// src/services/aiOperations.js
export const getAIResponse = async (query, docList) => {
  console.log('Generating AI response for:', query);

  if (typeof window === 'undefined' || !window.ai || !window.ai.languageModel) {
    throw new Error('Gemini nano (window.ai) が利用できない環境です。');
  }

  const capabilities = await window.ai.languageModel.capabilities();
  if (!capabilities.available) {
    throw new Error('AI model is not available on this browser.');
  }

  const docsText = docList
    .map(doc => `ID=${doc.id}: ${doc.content.trim()}`)
    .join('\n');

  // 架空惑星に関する情報を参照するよう誘導
  const systemPrompt = `
あなたは「架空のSF惑星」に関する専門家です。
与えられた文書に書いてある情報以外は推測せず、
もし文書にない事柄を聞かれたら「わかりません」と回答してください。
回答は日本語で行ってください。
  `;

  const userPrompt = `
ユーザの質問: "${query}"

検索ヒットした文書:
${docsText}

これらの情報を参考に、可能な限り詳しく答えてください。
もし情報が足りない場合は、無理に推測せずにわからない旨を述べてください。
`;

  const aiSession = await window.ai.languageModel.create({
    systemPrompt
  });

  const response = await aiSession.prompt(userPrompt);
  console.log('AI response generated successfully');
  return response;
};