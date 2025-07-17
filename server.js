const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ Nessuna chiave OPENAI_API_KEY");
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Sei un assistente utile e preciso.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } } catch (error) {
  const status = error.response?.status || 500;
  const errorData = error.response?.data || error.message;
  console.error("❌ ERRORE OpenAI:", errorData);
  res.status(status).json({
    error: status === 429
      ? "Hai superato il limite di richieste. Riprova tra poco."
      : errorData,
  });
}


});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server attivo su porta ${port}`);
});

