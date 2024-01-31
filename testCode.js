
//const puppeteer = require('puppeteer');
import puppeteer from "puppeteer";

(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
  
    // Enable request interception
    await page.setRequestInterception(true);
  
    // Arrays to store information about ad-related requests and responses
    const adRequests = [];
    const adResponses = [];
  
    page.on('request', (request) => {
        // Continue with the request
        request.continue();
      });
    
      page.on('response', async (response) => {
        // Check if the response corresponds to an ad request
        if(response.url().includes('https://securepubads.g.doubleclick.net')) {
          // Log or process the response data
          const responseData = await response.text();
          adRequests.push({
            url: response.url(),
            method: response.request().method(),
            headers: response.headers(),
            postData: response.request().postData(),
          });
          //adResponses.push({
            //url: response.url(),
            //status: response.status(),
            //headers: response.headers(),
            //body: responseData,
          //});
        }
      });
    // Navigate to the webpage
    await page.goto('https://www.forbes.com'); // Replace with the URL of the web page you want to analyze
  
    console.log('Ad Requests:', adRequests);
    console.log('Ad Responses:', adResponses)
    await browser.close();

    })();