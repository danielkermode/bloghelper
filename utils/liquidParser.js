/* ********
  AUTHOR: danielkermode
  DATE: 6 March 2016
  DESCRIPTION: Parser function to convert liquid template to an html string with params.
  NOTES: Returns a promise so must be handled in promise chain.

******** */
import Liquid from 'liquid-node';
import fs from 'fs';
const engine = new Liquid.Engine;

export const liquidToString = (filePath, obj) => {
  return new Promise((resolve) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      engine
      .parseAndRender(data, Object.assign({}, obj))
      .then(result => {
        resolve(result);
      });
    });
  });
};