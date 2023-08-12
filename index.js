
const { fetchData } = require('./src/fetchData');



async function main(){
    const org = 'facebook';
    const repo = 'react';
    const initialDate = '2022-01-01';
    const status = 'open';
    const type = 'pr';
    let hasNextPage = true;
    let nextCursor = null;

    const result = await fetchData(status, type, org, repo, initialDate, hasNextPage, nextCursor);
    
    console.log(result);
    console.log(hasNextPage, nextCursor);
    console.log(result.length);
    
}

main();
