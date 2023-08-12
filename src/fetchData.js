const axios = require('axios');
const dotenv = require('dotenv');
const { buildQueryPRSeach } = require('./query-pr');

const logger = console;

dotenv.config();

const { GITHUB_TOKEN } = process.env;
let prs = [];

async function fetchData(status, type, org, repo, initialDate, nextCursor) {
  const url = 'https://api.github.com/graphql';

  const query = buildQueryPRSeach(status, type, org, repo, initialDate, nextCursor);

  const response = await axios.post(url, { query }, {
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
    },
  });

  const { data } = response;
  if (data.errors) {
    logger.log(data.errors);
    return;
  }
  const { data: { search: { pageInfo: { hasNextPage: next, endCursor }, edges } } } = data;

  prs = prs.concat(edges);

  if (next) {
    await fetchData(status, type, org, repo, initialDate, endCursor);
  }

  // eslint-disable-next-line consistent-return
  return prs;
}

module.exports = {
  fetchData,
};
