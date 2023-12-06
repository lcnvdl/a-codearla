import express from 'express';
import { exec } from 'child_process';
import { mkConfig, generateCsv, asString } from 'export-to-csv';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/csv', (req, res) => {
  const csvConfig = mkConfig({ useKeysAsHeaders: true });

  const mockData = [{
    name: "Rouky",
    date: "2023-09-01",
    percentage: 0.4,
    quoted: '"Pickles"',
  },
  {
    name: "Keiko",
    date: "2023-09-01",
    percentage: 0.9,
    quoted: '"Cactus"',
  }];

  const csv = generateCsv(csvConfig)(mockData);
  res.send(asString(csv));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
const url = `http://localhost:${port}`;
exec(start + ' ' + url);
