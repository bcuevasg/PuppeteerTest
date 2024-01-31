import puppeteer from 'puppeteer';
import * as chai from 'chai';
const { expect } = chai;

describe('Example Test Suite', () => {
  let browser;
  let page;

  // Run before all tests
  before(async () => {
    // if you want to see the browser change the headless value to false instead of 'new'
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1000,
      deviceScaleFactor: 1,
    });
    await page.waitForNetworkIdle();
    await page.goto('https://www.forbes.com/');
    new Promise(r => setTimeout(r, 5000));
  });

  // Run after all tests
  after(async () => {
    await browser.close();
  });


  // Test cases identified by 'it'
  it('Confirm Forbes Title', async () => {
    await page.waitForNetworkIdle();
    //await page.waitForSelector('title[itemprop]');
    const title = await page.title();
    expect(title).to.equal('Forbes');
  });

  it('Ads are present', async () => {
    // leaving a timeout before it starts this test case
    new Promise(r => setTimeout(r, 5000));
    // check if specific top ad is present
    const adElement = await page.$('fbs-ad[position=top][display-called]');
    // assert that the ad element is present
    expect(adElement).to.exist;
  });

  it('Proper dimensions for 1st ad', async () => {
    //leaving a timeout before it starts this test case
    new Promise(r => setTimeout(r, 5000));
    // Identify 1st Ad element "adElement" and store their size on "adDimensions"
    const adElement = await page.$('fbs-ad[position=top][display-called]');
    const adDimensions = await adElement.boundingBox();

    // Assert that the ad has proper dimension comparing it with a minimum width and height
    expect(adDimensions.width).to.be.above(100);
    expect(adDimensions.height).to.be.above(50);
    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });
    await page.screenshot({path: './screenshots/ForbesPage.png', fullPage: true});
  });

  it('Expected number of ads on the page', async () => {
    // Enable request interception
    await page.setRequestInterception(true);
    // Array to store the ads info to identify
    const adRequests = [];

    // Listen for network requests
    page.on('request', (request) => {
      // Inspect the URL, headers, or other properties to identify ad requests
      if (request.url().includes('https://securepubads.g.doubleclick.net')) {
        adRequests.push(request);
      }
      request.continue();
    });

    // Reload page to work with this case forbes
    await page.goto('https://www.forbes.com/');

    // Wait for the page to load and move to the bottom of the page
    new Promise(r => setTimeout(r, 5000));
    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });

    // Turn off the  request interception so the browsing is normal
    await page.setRequestInterception(false);

    // Adjust the expected count based on your specific webpage
    const minimunAdsCount = 7;
    const adCount = adRequests.length;
    
    // Assert that the actual ad count matches the expected count
    expect(adCount).to.above(minimunAdsCount);
    console.log({adCount, minimunAdsCount});
    await page.screenshot({path: './screenshots/BottomForbesPageCountAds.png'});
  });

  it('Check "Malware" word for Ads on page', async () => {
    // Enable request interception
    await page.setRequestInterception(true);
    // Array to store the ads info to identify
    const adRequests = [];

    // Listen for network requests
    page.on('request', (request) => {
      // Inspect the URL, headers, or other properties to identify ad requests
      if (request.url().includes('https://securepubads.g.doubleclick.net')) {
        adRequests.push(request);
      }
      request.continue();
    });

    // Reload page to work with this case forbes
    await page.goto('https://www.forbes.com/');

    // Wait for the page to load and move to the bottom of the page
    new Promise(r => setTimeout(r, 5000));
    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });

    // Turn off the  request interception so the browsing is normal
    await page.setRequestInterception(false);

    //For that will check the resposnses to check the word "Malware" on it
    for (const request of adRequests) {
      const response = await request.response();

      const responseBody = await response.text();

     // Variable that will store the result of checking if response has Malware
      const isMalware = checkForMalware(responseBody);
      

      // Assert that the ad content does not contain malware on response body
      expect(isMalware, 'Ad content contains malware').to.be.false;
    }
    
  });

  it('Check "Spam" ads on page', async () => {
    // Enable request interception
    await page.setRequestInterception(true);
    // Array to store the ads info to identify
    const adRequests = [];

    // Listen for network requests
    page.on('request', (request) => {
      // Inspect the URL, headers, or other properties to identify ad requests
      if (request.url().includes('https://securepubads.g.doubleclick.net')) {
        adRequests.push(request);
      }
      request.continue();
    });

    // Reload page to work with this case forbes
    await page.goto('https://www.forbes.com/');

    // Wait for the page to load and move to the bottom of the page
    new Promise(r => setTimeout(r, 5000));
    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });

    // Turn off the  request interception so the browsing is normal
    await page.setRequestInterception(false);

    //For that will check the resposnses to check the word "Spam" on it
    for (const request of adRequests) {
      const response = await request.response();
      const responseBody = await response.text();
      // Variable that will store the resutl of the method
      const isSpam = checkForSpam(responseBody);

      // Assert that the ad content does not contain spam on response body
      expect(isSpam, 'Ad content contains spam').to.be.false;
    }
  });


});

function checkForMalware(content) {
  return content.toLowerCase().includes('malware');
}
function checkForSpam(content) {
  return content.toLowerCase().includes('spam');
}
