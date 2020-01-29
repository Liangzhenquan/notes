import {request, GraphQLClient } from 'graphql-request';
const baseURL = 'http://localhost:7000'
const gPost = (url, query,variables = {}) => {
  new Promise((resolve, reject) => {
    request(`${baseURL}${url}`, query, variables)
    .then(data =>
      resolve(data)
    )
    .catch(error => {
      reject(error)
    })
  })
}
export {gPost}