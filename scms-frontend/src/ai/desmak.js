// AI assistant using backend API instead of direct ollama client
export const desmakai = async (prompt, onChunk) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // Make API call to backend
    const response = await fetch(`${apiUrl}/api/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const fullResponse = data.response || 'Sorry, I could not process your request.';

    // If onChunk callback provided, send the full response at once
    if (onChunk) {
      onChunk(fullResponse);
    }

    return fullResponse;
  } catch (error) {
    console.error('AI Error:', error);
    return 'AI assistant is currently unavailable. Please try again later.';
  }
}

// Function to analyze crop images with vision model
