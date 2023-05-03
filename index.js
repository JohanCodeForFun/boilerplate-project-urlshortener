require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  const urlPattern = /\w{4}:\/\/\w{3}.\w+.com/g;
  
  if (urlPattern.test(req.body.url)) {
    res.json({"original_url":"https://www.google.com","short_url":1})
  } else {
    res.json({ error: 'invalid url' });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
