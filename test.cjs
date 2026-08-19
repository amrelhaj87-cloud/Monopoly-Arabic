const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000/');
  
  await page.evaluate(() => {
    localStorage.setItem('monopoly_arabic_current_user', JSON.stringify({
      uid: 'guest_123',
      displayName: 'Amro',
      photoURL: '👨‍🚀',
      isGuest: true,
      selectedToken: 'falcon',
      stats: { gamesPlayed: 0, gamesWon: 0, highestNetWorth: 1500, propertiesMonopolized: 0 },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));
  });

  await page.reload();

  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(b => b.textContent && b.textContent.includes('بدء مباراة فردية'));
      if (startBtn) startBtn.click();
    });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 1000));
  
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const finalStartBtn = buttons.find(b => b.textContent && b.textContent.includes('بدء المباراة الآن'));
      if (finalStartBtn) finalStartBtn.click();
    });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 3000));
  
  await page.screenshot({ path: 'screenshot3.png' });
  console.log('Screenshot 3 saved.');
  await browser.close();
})();
