/** Date: 2020/3/12 ; Author: 姜啸 **/
// to.js
export default function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}
