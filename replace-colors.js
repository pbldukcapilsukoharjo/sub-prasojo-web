const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { regex: /bg-white/g, replacement: 'bg-surface' },
  { regex: /bg-gray-50/g, replacement: 'bg-background' },
  { regex: /bg-\[\#F9FAFB\]/g, replacement: 'bg-background' },
  { regex: /text-gray-900/g, replacement: 'text-text-primary' },
  { regex: /text-gray-800/g, replacement: 'text-text-primary' },
  { regex: /text-gray-700/g, replacement: 'text-text-secondary' },
  { regex: /text-gray-600/g, replacement: 'text-text-secondary' },
  { regex: /text-gray-500/g, replacement: 'text-text-secondary' },
  { regex: /text-gray-400/g, replacement: 'text-text-secondary' },
  { regex: /border-gray-100/g, replacement: 'border-border' },
  { regex: /border-gray-200/g, replacement: 'border-neutral' },
  { regex: /border-slate-100/g, replacement: 'border-border' },
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Replacement complete.');
