const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const content = require('./data/content.json');
const templatePath = path.join(__dirname, 'views', 'index.ejs');
const template = fs.readFileSync(templatePath, 'utf-8');
const html = ejs.render(template, { content }, { filename: templatePath });
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), html);
console.log('index.html gerado em public/');
