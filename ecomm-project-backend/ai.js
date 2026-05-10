const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI shopping assistant for a watch ecommerce website.

Your job:
- Help users find watches
- Answer product questions
- Help with orders
- Give stylish recommendations
- Talk professionally
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "AI Error",
    });
  }
});

module.exports = router;