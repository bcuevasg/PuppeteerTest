import puppeteer from 'puppeteer';

async function checkAdsWithAdContent() {
  const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.forbes.com');
    await page.waitForNetworkIdle();
    // Specify the selector for the ads on the website (replace with your actual selector)
    const adSelector = 'fbs-ad[position]';
    await page.evaluate(() => {
        window.scrollBy(0, document.body.scrollHeight);
      });
    // Get all ads on the page
    const ads = await page.$$(adSelector);

    // Iterate through each ad
    for (const ad of ads) {
      // Get the content of the ad
      const adContent = await ad.evaluate(el => el.textContent);

      // Check if the word "spam" is present in the ad content
      if (adContent.toLowerCase().includes('google')) {
        console.log('Potential spam detected in ad:', adContent);
      } else {
        console.log('Ad content seems fine:', adContent);
      }
    }

    // Close the browser
    await browser.close();
};

async function checkAdsWithResponse() {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    const ads =[];
    
    await page.setRequestInterception(true);

    // Listen for network requests
    page.on('response', (response) => {
      // Inspect the URL, headers, or other properties to identify ad requests
      if (response.url().includes('https://securepubads.g.doubleclick.net')) {
        ads.push(request);
      }
      request.continue();
    });
    
    await page.goto('https://www.forbes.com');
    await page.waitForNetworkIdle();

    await page.evaluate(() => {
        window.scrollBy(0, document.body.scrollHeight);
    });
    await page.waitForNetworkIdle();
    console.log(ads)

    await browser.close();
};

checkAdsWithResponse();
