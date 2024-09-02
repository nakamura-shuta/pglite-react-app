export const getAIResponse = async (apiKey, query, eventDataList) => {
    console.log('Generating AI response for:', query);
    const eventsText = eventDataList
      .map(event => `${event.year}年: ${event.event}`)
      .join('\n');
  
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `質問: "${query}"
  
  以下は関連する会社の出来事です：
  ${eventsText}
  
  これらの情報を元に、質問に答えてください。関連する出来事をすべて使用し、時系列順に説明してください。
  また、それぞれの年の世間の出来事や背景も簡単に説明してください。回答は日本語でお願いします。` },
            ],
          },
        ],
      }),
    });
  
    const data = await response.json();
    console.log('AI response generated successfully');
    return data.content[0].text;
  };