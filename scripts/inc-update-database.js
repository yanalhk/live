#!/usr/bin/env node
const program = require('commander');
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;
const cheerio = require('cheerio');
const Entities = require('html-entities').XmlEntities;
const path = require('path');
const { parse, format } =require('fecha');
const naturalCompare = require("natural-compare-lite");

function readMessageFile(file) {
  let json = {
    messages: []
  }
  try {
    json = JSON.parse(fs.readFileSync(file));
  } catch (e) {
  }

  return json;
}

function normalizeMessages(origVersion, newVersion) {
  const tmp = new Map();

  const insert = (message) => {
    tmp.set(message.id, message);
  }

  origVersion.forEach(insert);
  newVersion.forEach(insert);

  return [...tmp.values()].sort( (a,b ) => {
    return naturalCompare(a.id, b.id);
  });
}

function run(inputXml, outputFolder) {
  const entities = new Entities();

  const content = fs.readFileSync(inputXml);
  const $ = cheerio.load(content);

  const data = new Map();
  const elem = $('.message');

  $(elem).each((messageIndex, message) => {
    const date = $(message).find('.date').attr('title');
    if (!date)
      return;
    const id = $(message).attr('id');
    if (!id) {
      return;
    }
    const from = $(message).find('.from_name').text().trim();
    const text = entities.decode($(message).find('.text').html()).trim();

    let [day, time] = date.split(' ');
    day = format(parse(day, 'DD.MM.YYYY'), 'YYYYMMDD');

    const messages = data.get(day) ?? [];
    data.set(day, messages.concat({
      id, day, time, from, text
    }));
  });

  data.forEach((messages, key) => {
    const outputFile = path.resolve(outputFolder, `${key}.json`);
    const orig = readMessageFile(outputFile);

    const normalizedMessages = normalizeMessages(orig.messages, messages);
    const content = JSON.stringify({messages: normalizedMessages}, null, 2);
    fs.writeFileSync(outputFile, content);
    console.info(`Written to ${outputFile}`);
  });
}

program
  .version('0.0.1')
  .arguments('<inputXml> <outputFolder>')
  .usage('inputXml outputFolder')
  .action(run)
  .parse(process.argv);
