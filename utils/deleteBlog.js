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

export function deleteBlog(link) {
  const walker  = walk.walk("../", { followLinks: false, filters: ["Temp", "node_modules"] })
  const regex = new RegExp('\<li\>\<a class="my-a" href="'+ link + '"\>.+\</a\>\</li\>');

  walker.on("file", function(root, fileStat, next) {
    if(/^.+\.html$/.test(fileStat.name)) {
      const currentNav = fs.readFileSync(root + '/' + fileStat.name, 'utf8');
      const newNav = currentNav.replace(regex, '');
      if(newNav === currentNav) {
        console.log(chalk.yellow('No matching link found for ' + fileStat.name));
        next();
        return;
      }
      console.log(chalk.cyan('Changing nav for file (deleting): ') + fileStat.name);
      fs.writeFileSync(root + '/' + fileStat.name, newNav, 'utf8');
    }
    next();
  });

  walker.on("errors", errorsHandler);
  walker.on("end", endHandler);
  //adjust nav
  const currentNavLiq = fs.readFileSync('templates/nav.liquid', 'utf8');
  const newNavLiq = currentNavLiq.replace(regex, '');
  console.log(chalk.green('Changing nav.liquid.'));
  fs.writeFileSync('templates/nav.liquid', newNavLiq, 'utf8');

  //delete file
  const filename = link.replace(/^.+\/([^\/]+)$/, '$1')
  fs.lstat('../blog/' + filename, function(err, stats) {
    if (!err) {
      fs.unlinkSync('../blog/' + filename);
      console.log(chalk.green('unlinked file ' + filename));
    } else {
      console.log(chalk.red('file didnt exist.'));
    }
  });
}

