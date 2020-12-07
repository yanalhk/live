#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const { parse, format } =require('fecha');
const naturalCompare = require("natural-compare-lite");
const shell = require('shelljs');
const TurndownService = require('turndown')

function readJsonFile(file) {
  let json = {
    messages: []
  }
  try {
    json = JSON.parse(fs.readFileSync(file));
  } catch (e) {
  }

  return json;
}

function genMessageFile(inputFolder, outputFolder) {
  const turndownService = new TurndownService();

  const inputFiles = shell.ls(`${inputFolder}/*.json`);
  inputFiles.forEach( jsonFile => {
    const date = parse(jsonFile, 'YYYYMMDD');
    const outputPrefix = format(date, 'YYYY/MM');
    const outputPath = path.resolve(outputFolder, outputPrefix, format(date, 'YYYYMMDD') + '.md');
    shell.mkdir('-p', path.dirname(outputPath));
    const json = readJsonFile(jsonFile);

    const content = [`#${format(date, "YYYY-MM-DD")}\n\n`];

    json.messages.forEach (message => {
      const markdown = turndownService.turndown(message.text);
      const text = markdown.replace(/#/g, '\\#');
      content.push(
`${message.time}

${message.from}

${text}

---
      `);
    });

    fs.writeFileSync(outputPath, content.join('\n'));
    console.info(`Written to ${outputPath}`);
  })
}

function run(inputFolder, outputFolder) {
  genMessageFile(inputFolder, outputFolder);
}

program
  .version('0.0.1')
  .arguments('<inputFolder> <outputFolder>')
  .usage('inputFolder outputFolder')
  .action(run)
  .parse(process.argv);
