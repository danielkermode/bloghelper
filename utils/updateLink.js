import fs from 'fs';
import chalk from 'chalk';
import walk from 'walk';

function errorsHandler(root, nodeStatsArray, next) {
  nodeStatsArray.forEach(function (n) {
    console.error("[ERROR] " + n.name);
    console.error(n.error.message || (n.error.code + ": " + n.error.path));
  });
  next();
}

function endHandler() {
  console.log(chalk.green("All done with links."));
}

export function updateLink(link, newLink) {
  const walker  = walk.walk("../", { followLinks: false, filters: ["Temp", "node_modules"] });
  const regex = new RegExp('\<li\>\<a class="my-a" href="(.+)"\>' + link + '\</a\>\</li\>');

  walker.on("file", function(root, fileStat, next) {
    if(/^.+\.html$/.test(fileStat.name)) {
      const currentNav = fs.readFileSync(root + '/' + fileStat.name, 'utf8');
      const newNav = currentNav.replace(regex, '\<li\>\<a class="my-a" href="$1"\>' + newLink + '\</a\>\</li\>');
      if(newNav === currentNav) {
        console.log(chalk.yellow('No matching link found for ' + fileStat.name));
        next();
        return;
      }
      console.log(chalk.cyan('Changing nav for file (updating): ') + fileStat.name);
      fs.writeFileSync(root + '/' + fileStat.name, newNav, 'utf8');
    }
    next();
  });

  walker.on("errors", errorsHandler);
  walker.on("end", endHandler);
}