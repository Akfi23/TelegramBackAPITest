const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(express.json());

// CORS для изображений
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/sharestory/, async (msg) => {
    console.log('Received /shareStory from:', msg.chat.id);
    await bot.sendPhoto(msg.chat.id, 'https://your-server.com/images/game-screenshot.png', {
        caption: 'Check out my game! 👍'
    });
});

bot.on('web_app_data', async (msg) => {
    const chatId = msg.chat.id;
    const data = msg.web_app_data.data;
    console.log('Received web_app_data:', data);
    if (data === '/shareStory') {
        await bot.sendPhoto(chatId, 'https://your-server.com/images/game-screenshot.png', {
            caption: 'Check out my game! 👍'
        });
    }
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    const imageUrl = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/uploads/${req.file.filename}`;
    res.send(imageUrl);
});

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('Bot is running'));
app.listen(3000, () => console.log('Server running on port 3000'));
