const express = require('express');
const { clickNotYou } = require('./clicker');

const app = express();
const PORT = process.env.PORT || 3000;
const INTERVAL_MS = parseInt(process.env.CLICK_INTERVAL_MS || '60000');

app.get('/', (_, res) => res.send('OWOBot Clicker running ✅'));

app.post('/click', async (_, res) => {
  const result = await clickNotYou();
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`[server] Port ${PORT} | Interval ${INTERVAL_MS}ms`);
  (async () => {
    while (true) {
      console.log('[auto] Clicking...');
      const r = await clickNotYou();
      console.log('[auto]', r);
      await new Promise(res => setTimeout(res, INTERVAL_MS));
    }
  })();
});