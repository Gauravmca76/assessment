const puppeteer = require ('puppeteer');

//initiating Puppeteer
puppeteer
  .launch ()
  .then (async browser => {
  
    //opening a new page and navigating to Reddit
    const page = await browser.newPage ();
    await page.goto ('https://prefeitura.pbh.gov.br/saude/licitacao/pregao-eletronico-151-2020');
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "language", {
            get: function() {
                return "en";
            }
        });
        Object.defineProperty(navigator, "languages", {
            get: function() {
                return ["en-EN", "en"];
            }
        });
    });
    await page.waitForSelector ('body');
  
    //manipulating the page's content
    let grabPosts = await page.evaluate (() => {
    let allPosts = document.body.querySelectorAll('.lbl-licitacao');
      
    //storing the post items in an array then selecting for retrieving content
    scrapeItems = [];
    allPosts.forEach (item => {
      //let postTitle = item.querySelector ('span').innerText;
      let cssSelector = item.querySelector('span').innerText;
      let postDescription = '';
        try {
          //postDescription = item.querySelector('span').innerText;
          postDescription = item.font.querySelectorAll('font > font').innerText;
        } catch (err) {}
        scrapeItems.push ({
          //postTitle: postTitle,
          cssSelector: cssSelector,
          postDescription: postDescription
        });
      });
      let items = {
        "redditPosts": scrapeItems,
      };
      return items;
    });
    //outputting the scraped data
    console.log (grabPosts);
    //closing the browser
    await browser.close ();
  })
  //handling any errors
  .catch (function (err) {
    console.error (err);
  });