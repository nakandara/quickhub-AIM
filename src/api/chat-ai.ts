import axios from 'src/utils/axios';

export async function sendChatMessage(question: string) {
  try {
    const response = await axios.post('https://agenticaiquickads-production.up.railway.app/ask', {
      question,
    });

    // Extract the content from the response
    return response.data.answer.content;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
} 