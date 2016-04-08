import { liquidToString } from './liquidParser';
import fs from 'fs';
import chalk from 'chalk';
import walk from 'walk';

function errorsHandler(root, nodeStatsArray, next) {
  nodeStatsArray.forEach(function (n) {
    console.error("[ERROR] " + n.name)
    console.error(n.error.message || (n.error.code + ": " + n.error.path));
  });
  next();
}

function endHandler() {
  console.log(chalk.green("All done with links."));
}

export function newBlog(title, link, date, category) {
  // first parse liquid template.
  let techLink = '';
  let cultLink = '';
  if(category === 'technical') {
    techLink = '<li><a class="my-a" href="' + link + '">' + title + '</a></li>'
  } else if(category === 'cultural') {
    cultLink = '<li><a class="my-a" href="' + link + '">' + title + '</a></li>'
  }
  liquidToString('./templates/nav.liquid', {
    techLink,
    cultLink
  }).then(nav => {
    const walker  = walk.walk("../", { followLinks: false, filters: ["Temp", "node_modules"] });
    const regex = /\<\!--nav--\>[^]+\<\!--nav--\>/;

    walker.on("file", function(root, fileStat, next) {
      if(/^.+\.html$/.test(fileStat.name)) {
        const currentNav = fs.readFileSync(root + '/' + fileStat.name, 'utf8');
        const newNav = currentNav.replace(/\<\!--nav--\>[^]+\<\!--nav--\>/, nav);
        console.log(chalk.cyan('Changing nav for file(adding): ') + fileStat.name);
        fs.writeFileSync(root + '/' + fileStat.name, newNav, 'utf8');
      }
      next();
    });

    walker.on("errors", errorsHandler);
    walker.on("end", endHandler);

    //adjust nav.liquid
    const oldNavLiq = fs.readFileSync('templates/nav.liquid', 'utf8');
    const newNavLiq = oldNavLiq.replace(/{{techLink}}/, techLink +
    (techLink && '\n                ') + '{{techLink}}').replace(/{{cultLink}}/, cultLink +
    (cultLink && '\n                ') + '{{cultLink}}');
    console.log(chalk.green('Changing template nav'));
    fs.writeFileSync('templates/nav.liquid', newNavLiq, 'utf8');

    return liquidToString('./templates/newBlog.liquid', {
      title,
      nav,
      date
    })
  }).then(htmlstring => {
    const filename = link.replace(/^.+\/([^\/]+)$/, '$1');
    fs.writeFileSync('../blog/' + filename, htmlstring, 'utf8');
    console.log(chalk.green('created file ' + filename));
  })
}

