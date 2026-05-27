const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'GhostPath Studio - Digital Agency',
    currentPage: 'home'
  });
});

app.listen(PORT, () => {
  console.log(`GhostPath Studio running at http://localhost:${PORT}`);
});
