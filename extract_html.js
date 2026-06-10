const fs = require('fs');
const html = fs.readFileSync('api/ornek-rapor-maili.html', 'utf8');
const startIndex = html.indexOf('<div id="converted-body"');
let extracted = '';
if (startIndex !== -1) {
  const substr = html.substring(startIndex);
  // find the end of converted-body (this is a bit tricky with simple string methods, so let's use a simple heuristic or cheerio)
}
