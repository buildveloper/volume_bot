import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
const bot = new TelegramBot('8171699930:AAGioMc4CDR2m0eGiNriZfjO-GnL0wCGcEQ', { polling: true });
const subscribers = new Set();

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    subscribers.add(chatId);
    bot.sendMessage(chatId, 'Welcome! You will receive alerts when the volume exceeds 10 Million USD');
  });
  
  function checkVolume() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin')
      .then(response => response.json())
      .then(data => {
        const totalVolume = data[0].total_volume;
        console.log('Bitcoin total volume:', totalVolume);
        // If volume exceeds 10 million USD, send an alert to all subscribers.
        if (totalVolume > 10_000_000) {
          subscribers.forEach((chatId) => {
            bot.sendMessage(chatId, `Alert: Bitcoin volume exceeds 10 million USD! The current volume is: ${totalVolume}`);
          });
        }
      })
      .catch(error => console.error('Error fetching volume:', error));
  }
  
  setInterval(checkVolume, 120000); 

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });  