const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './map_data.db',
  },
  useNullAsDefault: true,
});

app.use(cors());

// Делаем папку 'public' публичной, чтобы сервер мог отдавать из нее файлы (картинки)
app.use(express.static('public'));

// Маршрут для API, отдает данные из БД
app.get('/api/apartments', async (req, res) => {
  try {
    const apartments = await knex('apartments').select('*');
    apartments.forEach(apt => {
        if (typeof apt.photos === 'string') {
            apt.photos = JSON.parse(apt.photos);
        }
    });
    res.json(apartments);
  } catch (error) {
    console.error('Ошибка при получении данных из БД:', error);
    res.status(500).json({ error: 'Не удалось получить данные' });
  }
});

// Маршрут для главной страницы, отдает файл index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен. Откройте http://localhost:${port} в браузере.`);
});