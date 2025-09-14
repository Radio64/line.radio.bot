const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

app.post("/webhook", (req, res) => {
  const events = req.body.events;
  if (!events) return res.sendStatus(200);

  events.forEach(event => {
    if (event.type === "message" && event.message.type === "text") {
      const replyToken = event.replyToken;
      const userMessage = event.message.text.toLowerCase();

      let replyText = "🎶 Thanks for tuning in! Our showtimes are 7pm EST nightly.";

      if (userMessage.includes("schedule")) {
        replyText = "📅 Schedule: Mon–Fri 7pm EST, Sat 6pm EST.";
      }

      axios.post(
        "https://api.line.me/v2/bot/message/reply",
        {
          replyToken: replyToken,
          messages: [{ type: "text", text: replyText }]
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
          }
        }
      );
    }
  });

  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Bot running on port " + port);
});
