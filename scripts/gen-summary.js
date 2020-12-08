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

function run(gitbookFolder) {

  const files = shell.find(gitbookFolder).filter (file => {
    return file.match(/[0-9]{8}.md$/);
  }).sort(naturalCompare);

  const index = new Map();
  files.forEach( file => {
    const basename = path.basename(file);
    const date = parse(basename, 'YYYYMMDD');
    const month = format(date,'YYYY-MM');
    const files = index.get(month) ?? [];
    files.push(file);
    index.set(month, files);
  });

const summaryPrefix =
`# Summary

* [法庭文字直播台轉播站](README.md)
`

  const content = [];
  content.push(summaryPrefix);

  index.forEach( (value, key) => {
    content.push(`* ${key}`)

    value.forEach( (md) => {
      const strippedPath = path.relative(gitbookFolder, md);
      const date = parse(path.basename(strippedPath), 'YYYYMMDD');
      const title = format(date, 'YYYY-MM-DD');
      content.push(`  * [${title}](${strippedPath})`);
    })
  });

  const summaryFile = path.resolve(gitbookFolder, 'SUMMARY.md');
  fs.writeFileSync(summaryFile, content.join('\n'));
  console.info(`Written to ${summaryFile}`);
}

program
  .version('0.0.1')
  .arguments('<gitbookFolder>')
  .usage('gitbookFolder')
  .action(run)
  .parse(process.argv);
