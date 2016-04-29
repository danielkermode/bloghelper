import fs from 'fs';
import chalk from 'chalk';

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().replace(/T.+/, '');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSum(n, t){
  const max = n * (n + 1) / 2;
  if(t < max) return 'Input error';
  let list = [], sum = 0, i
  i = n;
  while(i--) {
    const r = Math.random();
    list.push(r);
    sum += r;
  }
  const factor = t / sum;
  sum = 0;
  i = n;
  while(--i) {
    list[i] = parseInt(factor * list[i]);
    sum += list[i];
  }
  list[0] = t - sum;
  return list;
};

function digFormat(n){
  return n > 9? n : '0' + n;
}

export function genTime(date, number, time) {
  let csvContent = '';
  const columns = ['Client', 'Project', 'User']; //days 1-5 and toggl user info

  for(let i = 0; i < 7; i++) {
    columns.push(addDays(date, i));
  }
  columns.push('Total');
  columns.forEach(val => {
    csvContent += val + ',';
  });
  csvContent += '\n,learn web dev,Danielabkermode,';
  //generate random seconds and convert it to hours/minutes
  const totMins = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  const randTimes = randomSum(7, totMins);
  randTimes.forEach(val => {
    csvContent += digFormat(Math.floor(val / 60)) + ':' + digFormat(val%60) + ':00,';
  });
  csvContent += time + ':00'
  const filename = number + "-time.csv";
  //create file
  fs.writeFileSync(filename, csvContent, 'utf8');
}