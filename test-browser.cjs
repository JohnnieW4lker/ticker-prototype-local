const puppeteer = require('puppeteer');
const fs = require('fs');

async function testSite() {
  console.log('🚀 Starting Puppeteer tests...\n');

  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    devtools: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log('❌ BROWSER ERROR:', text);
    } else if (type === 'warning') {
      console.log('⚠️  BROWSER WARNING:', text);
    } else if (type === 'log') {
      console.log('📝 BROWSER LOG:', text);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.log('❌ FAILED REQUEST:', request.url(), request.failure().errorText);
  });

  try {
    console.log('📄 Testing Dashboard (/)...');
    await page.goto('http://localhost:3003/', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'test-screenshots/dashboard.png', fullPage: true });

    // Check for content
    const dashboardContent = await page.content();
    const hasDashboard = dashboardContent.includes('Dashboard') || dashboardContent.includes('Market Overview');
    console.log(`   ${hasDashboard ? '✅' : '❌'} Dashboard content loaded`);

    // Wait a bit for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n📄 Testing Screener (/screener)...');
    await page.goto('http://localhost:3003/screener', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'test-screenshots/screener.png', fullPage: true });

    // Check for screener content
    const screenerContent = await page.content();
    const hasScreener = screenerContent.includes('Stock Screener') || screenerContent.includes('Presets');
    console.log(`   ${hasScreener ? '✅' : '❌'} Screener content loaded`);

    // Check if tabs are present
    const tabs = await page.$$('.nav-tabs .nav-link');
    console.log(`   ${tabs.length > 0 ? '✅' : '❌'} Tabs found: ${tabs.length}`);

    // Try clicking on presets tab
    if (tabs.length > 0) {
      await tabs[0].click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`   ✅ Clicked first tab`);
    }

    // Check for filter components
    const filterElements = await page.$$('.filter-presets, .basic-filters, .advanced-filters');
    console.log(`   ${filterElements.length > 0 ? '✅' : '❌'} Filter components found: ${filterElements.length}`);

    // Get page title
    const title = await page.title();
    console.log(`   📌 Page title: "${title}"`);

    // Get all errors from console
    console.log('\n📊 Collecting all console messages...');
    const logs = [];
    page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));

    // Check if Vue is loaded
    const vueLoaded = await page.evaluate(() => {
      return typeof window.__NUXT__ !== 'undefined';
    });
    console.log(`   ${vueLoaded ? '✅' : '❌'} Nuxt/Vue loaded`);

    // Get rendered HTML for debugging
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    fs.mkdirSync('test-output', { recursive: true });
    fs.writeFileSync('test-output/screener-html.html', bodyHTML);
    console.log('   💾 Saved rendered HTML to test-output/screener-html.html');

    // Check for specific elements
    const hasHeader = await page.$('.app-header');
    const hasMain = await page.$('.app-main');
    const hasScreenerPage = await page.$('.screener-page');

    console.log('\n🔍 Element Check:');
    console.log(`   ${hasHeader ? '✅' : '❌'} Header found`);
    console.log(`   ${hasMain ? '✅' : '❌'} Main content area found`);
    console.log(`   ${hasScreenerPage ? '✅' : '❌'} Screener page found`);

    // Test navigation
    console.log('\n🧭 Testing Navigation...');
    const navLinks = await page.$$('.nav-link');
    console.log(`   Found ${navLinks.length} navigation links`);

    console.log('\n✅ Tests completed!');
    console.log('📸 Screenshots saved to test-screenshots/');
    console.log('📄 HTML saved to test-output/');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-screenshots/error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Create directories
const dirs = ['test-screenshots', 'test-output'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

testSite().catch(console.error);
