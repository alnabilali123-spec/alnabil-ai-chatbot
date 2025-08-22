const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ المفتاح مضمّن بناءً على طلبك
const OPENROUTER_API_KEY = "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";

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// دردشة
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body?.message;
    if (!userMessage || !String(userMessage).trim()) {
      return res.status(400).json({ reply: "الرجاء كتابة رسالة." });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'preset:alnabil',
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "لم أستطع الحصول على رد.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "حدث خطأ في الخادم." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});