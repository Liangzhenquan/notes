import {fetch} from 'whatwg-fetch';
const post = (url,query,variables) => {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:7000${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables,
      })
    })
    .then(r =>
      r.json()
    )
    .then(data => {
      resolve(data)
    })
    .catch(error => {
      reject(error)
    })
  })
}
export {post}