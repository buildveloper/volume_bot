import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
app.use(express.json());
const bot = new TelegramBot('8171699930:AAGioMc4CDR2m0eGiNriZfjO-GnL0wCGcEQ', { polling: false });
const subscribers = new Set();

app.get('/', (req, res) => {
  res.send('Telegram Volume Bot is running!');
});

app.post('/', (req, res) => {
  bot.processUpdate(req.body); // Process Telegram updates
  res.sendStatus(200); // Acknowledge Telegram
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    subscribers.add(chatId);
    bot.sendMessage(chatId, 'Welcome! You will receive alerts when the volume exceeds 10 Million USD');
  });

  bot.onText(/\/checkvolume/, (msg) => {
    const chatId = msg.chat.id;
    checkVolume(chatId);
  });
  
  // Volume Monitoring
function checkVolume(chatId) {
  fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin')
    .then(response => response.json())
    .then(data => {
      const totalVolume = data[0].total_volume;
      console.log(`Bitcoin volume: ${totalVolume} USD`);
      if (totalVolume > 10000000) { // Raised to 1 billion USD
        bot.sendMessage(chatId, `Alert: Bitcoin volume exceeds 10 million USD! Current: ${totalVolume} USD`);
      } else {
        bot.sendMessage(chatId, `Volume is ${totalVolume} USD (below 10 million USD threshold)`);
      }
    })
    .catch(error => {
      console.error('Error fetching volume:', error);
      bot.sendMessage(chatId, 'Sorry, I couldn’t fetch the volume right now.');
    });
}
  
  setInterval(checkVolume, 120000);
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });