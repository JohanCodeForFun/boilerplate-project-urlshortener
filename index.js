require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./config/dbConfig');

// Basic Configuration
const port = process.env.PORT || 3000;

let urlArray = [];
let shortUrlCount = 0;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:id', async (req, res) => {

  const query = await db.query(`SELECT url FROM urls WHERE url_id = ${req.params.id}`);

  if (query.length === 0) {
    res.json({ error: 'invalid url' });
  } else {
    res.redirect(query[0].url);
  }
});

app.post('/api/shorturl', async (req, res) => {
  const urlPattern = /\w{4}:\/\/\w{3}.\w+.com/g;
  
  if (urlPattern.test(req.body.url)) {

    const queryUrlExists = await db.query(`SELECT url_id FROM urls WHERE url = '${req.body.url}'`);

    if (queryUrlExists.length > 0) {
      res.json({"original_url": req.body.url , "short_url": queryUrlExists[0].url_id})
    } else {
      const addUrl = await db.query(`INSERT INTO urls (url) VALUES ('${req.body.url}') RETURNING url_id, url`);

      res.json({"original_url": req.body.url , "short_url": addUrl[0].url_id});
    }
  } else {
    res.json({ error: 'invalid url' });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
