import program from 'commander';
import { newBlog } from './utils/newBlog';
import { deleteBlog } from './utils/deleteBlog';
import { updateLink } from './utils/updateLink';
import { genTime } from './utils/genTime';
import chalk from 'chalk';
import readline from 'readline';

program
  .command('db <link>')
  .description('delete a blog with the given filename plus all links to it in other files')
  .action(function(link){
    deleteBlog(link);
  });

program
  .command('ul <link> <newLink>')
  .description('updates a link title found in all files with a new link title.')
  .action(function(link, newLink){
    updateLink(link, newLink);
  });

program
  .command('gt <date> <number> <time>')
  .description('generates a timesheet for the requested date and sprint number.')
  .action(function(date, number, time){
    genTime(date, number, time);
  });

program
  .option('-c, --cultural', 'Make the blog cultural')
  .option('-t, --technical', 'Make the blog technical')
  .command('nb')
  .description('create a new blog template with the given arguments (defaults to technical blog)')
  .action(function(){
    if(program.cultural && program.technical) {
      console.log(chalk.yellow('Only one category flag should be specified. Exiting.'));
      return;
    }

    const rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt('title: ');
    rl.prompt();
    const args = {};
    rl.on('line', (line) => {
      if(!args.title) {
        args.title = line.trim();
        rl.setPrompt('link: ');
        rl.prompt();
      } else if(!args.link) {
        args.link = line.trim();
        rl.setPrompt('date: ');
        rl.prompt();
      } else if(!args.date) {
        args.date = line.trim();
        newBlog(args.title, args.link, args.date, program.cultural? 'cultural' : 'technical')
        rl.close();
      }
    })
  });

program.parse(process.argv);

