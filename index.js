const express = require('express');
const { clickNotYou } = require('./clicker');

const app = express();
const PORT = process.env.PORT || 3000;

// Render cần HTTP server để giữ instance sống
app.get('/', (req, res) => {
  res.send('OWOBot Clicker is running. POST /click to trigger.');
});

// Trigger thủ công qua HTTP
app.post('/click', async (req, res) => {
  console.log('[server] /click triggered');
  const result = await clickNotYou();
  res.json(result);
});

// Auto-click theo interval (đặt số giây tùy ý)
const INTERVAL_MS = parseInt(process.env.CLICK_INTERVAL_MS || '60000'); // mặc định 60s

async function autoLoop() {
  console.log(`[auto] Starting loop every ${INTERVAL_MS}ms`);
  while (true) {
    console.log('[auto] Running click...');
    const result = await clickNotYou();
    console.log('[auto] Result:', result);
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
}

app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
  // Chạy auto loop song song
  autoLoop().catch(console.error);
});