function buildQueryPRByOrg(org, nextCursor) {
    let repositories = `repositories(first: 100)`;
    if (nextCursor) {
        repositories = repositories + `, after: "${nextCursor}"`
    }
    const query = `
    query {
        organization(login: "${org}") {
            ${repositories} {
                nodes {
                    pullRequests(first: 100, states: OPEN, orderBy: {field: UPDATED_AT, direction: DESC}) {
                        nodes {
                            title
                            url
                            updatedAt
                        }
                    }
                }
            }
        }
    }
`;

    return query;
}

function buildQueryPRSeach(status, type, org, repo, initialDate, nextCursor) {
    let search = (`query: "is:${status} is:${type} is:public repo:${org}/${repo} created:>${initialDate}", type: ISSUE, first: 100`)
    if (nextCursor) {
        search = search + `, after: "${nextCursor}"`
    }
    console.log(search)

    const query = `
    {
        search(${search}) {
          pageInfo{
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          issueCount
          edges {
            node {
              ... on PullRequest {
                number
                title
                repository {
                  nameWithOwner
                }
                createdAt
                mergedAt
                url
                changedFiles
                additions
                deletions
              }
            }
          }
        }
        rateLimit{
          remaining
          resetAt
        }
      }
    `;

    return query;
}

module.exports = {
    buildQueryPRByOrg,
    buildQueryPRSeach
}