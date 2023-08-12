const axios = require('axios');
const dotenv = require('dotenv');
const { buildQueryPRSeach } = require('./queries/query-pr');

dotenv.config();

const { GITHUB_TOKEN } = process.env;

async function main(){
    const org = 'facebook';
    const repo = 'react';
    const initialDate = '2022-01-01';
    const status = 'open';
    const type = 'pr';
    const url = 'https://api.github.com/graphql';

    let hasNextPage = true;
    let nextCursor = null;
    let prs = [];
    while (hasNextPage) {
        const query = buildQueryPRSeach(status, type, org, repo, initialDate, nextCursor);

        const response = await axios.post(url, { query }, {
            headers: {
                Authorization: `bearer ${GITHUB_TOKEN}`
            }
        });

        const { data } = response;
        if(data.errors){
            console.log(data.errors);
            break;
        }
        const { data: { search: { pageInfo: { hasNextPage: next, endCursor }, edges } } } = data;

        hasNextPage = next;
        nextCursor = endCursor;

        prs = prs.concat(edges);        
    }
    
    console.log(prs);
    console.log(hasNextPage, nextCursor);
    
}

main();
