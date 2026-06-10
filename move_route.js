const fs = require('fs');
let content = fs.readFileSync('api/server.js', 'utf8');

const triggerBlockRegex = /\/\/ Trigger daily email report via cronjob[\s\S]*?res\.status\(500\)\.json\({ error: 'Failed to trigger daily report' }\);\s*}\s*}\);/g;

const match = content.match(triggerBlockRegex);
if(match) {
   let block = match[0];
   content = content.replace(block, '');
   
   const insertPoint = '// Compression middleware';
   content = content.replace(insertPoint, block + '\n\n' + insertPoint);
   fs.writeFileSync('api/server.js', content);
   console.log('Moved successfully!');
} else {
   console.log('Not found');
}
