const { chromium } = require('playwright');

const seeds = [75, 76, 77, 78, 79, 80, 81, 82, 83, 84];

async function scrapeSum(browser, seed) {
  var page = await browser.newPage();
  var url = 'https://sanand0.github.io/tdsdata/js_table/?seed=' + seed;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    var numbers = await page.evaluate(function() {
      var cells = document.querySelectorAll('table td, table th');
      var nums = [];
      cells.forEach(function(cell) {
        var text = cell.innerText.trim().replace(/,/g, '');
        var num = parseFloat(text);
        if (!isNaN(num)) nums.push(num);
      });
      return nums;
    });
    var sum = numbers.reduce(function(a, b) { return a + b; }, 0);
    await page.close();
    return sum;
  } catch(e) {
    await page.close();
    return 0;
  }
}

async function main() {
  var browser = await chromium.launch({ headless: true });
  var totalSum = 0;
  for (var i = 0; i < seeds.length; i++) {
    var sum = await scrapeSum(browser, seeds[i]);
    totalSum += sum;
  }
  await browser.close();
  console.log('TOTAL SUM = ' + totalSum);
}

main();
