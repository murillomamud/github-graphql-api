const { fetchData } = require('./src/fetchData');

const logger = console;

async function main() {
  const org = 'facebook';
  const repo = 'react';
  const initialDate = '2022-01-01';
  const status = 'open';
  const type = 'pr';

  const result = await fetchData(status, type, org, repo, initialDate, undefined);

  logger.log(result);
  logger.log(result.length);
}

main();
