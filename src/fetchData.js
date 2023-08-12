const axios = require('axios');
const dotenv = require('dotenv');
const { buildQueryPRSeach } = require('./query-pr.js');

dotenv.config();

const { GITHUB_TOKEN } = process.env;
let prs = [];

async function fetchData(status, type, org, repo, initialDate, hasNextPage, nextCursor) {
    const url = 'https://api.github.com/graphql';

    const query = buildQueryPRSeach(status, type, org, repo, initialDate, nextCursor);

    const response = await axios.post(url, { query }, {
        headers: {
            Authorization: `bearer ${GITHUB_TOKEN}`
        }
    });

    const { data } = response;
    if (data.errors) {
        console.log(data.errors);
        return;
    }
    const { data: { search: { pageInfo: { hasNextPage: next, endCursor }, edges } } } = data;

    hasNextPage = next;
    nextCursor = endCursor;

    prs = prs.concat(edges);

    if (hasNextPage) {
        await fetchData(status, type, org, repo, initialDate, hasNextPage, nextCursor);
    }

    return prs;
}

module.exports = {
    fetchData
}