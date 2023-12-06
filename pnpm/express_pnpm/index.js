const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
const url = `http://localhost:${port}`;
require('child_process').exec(start + ' ' + url);