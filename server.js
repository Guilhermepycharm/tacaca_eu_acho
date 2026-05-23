const express = require('express');
const helmet = require('helmet');
const path = require('path');
const content = require('./data/content.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { content });
});

// 404 — redireciona para a home
app.use((req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Tacacá site rodando em http://localhost:${PORT}`);
});
