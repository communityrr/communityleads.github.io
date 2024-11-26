import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for a roofing company. Capture lead information and answer roofing FAQs." },
        ...messages
      ],
    });

    const assistantMessage = completion.data.choices[0].message?.content;

    // Extract lead information (this is a simple example, you might want to use more sophisticated NLP)
    const leadInfo = extractLeadInfo(assistantMessage);

    res.status(200).json({ message: assistantMessage, leadInfo });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
}

function extractLeadInfo(message: string) {
  // This is a placeholder function. In a real application, you'd use more sophisticated
  // natural language processing to extract structured data from the message.
  const leadInfo = {};
  if (message.includes('name is')) {
    leadInfo.name = message.split('name is')[1].split('.')[0].trim();
  }
  if (message.includes('phone number is')) {
    leadInfo.phone = message.split('phone number is')[1].split('.')[0].trim();
  }
  // Add more extraction logic for other fields
  return leadInfo;
}

