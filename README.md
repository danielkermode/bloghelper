# bloghelper
helper scripts for my blog on github pages, written in node.js.

`git clone` then run `npm i` to install packages (needs npm and node installed).

##commands
Run `node dante --help` for a list of commands (created with commander npm module).

This is just a personal project and is intended for my own use mainly. In the "templates" folder are .liquid templates that contain the nav bar and new blog html for my site. The main annoyance I faced was pasting my new nav links into each existing html file when I made a new blog, so I've created functionality that does this (and creates the blog itself) with a command `node dante nb`. Basically all the script does is file manipulation using fs and a few other libraries.

Helper functions are in utils and the entry point is dante.js (this uses babel-register so I don't have to write in vanilla javascript).

I use this by putting the directory inside my github page directory (danielkermode.github.io). This is needed because the script automatically uses the parent directory to search through for all the commands. It also assumes a directory named 'blog' in the parent directory. Basically, it's fairly strict on directories. This is so I don't have to specify them when I run the commands (I could move this to a config file in the future).