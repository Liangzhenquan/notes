import '@babel/polyfill';
const isHas = [1,2,3].includes(2);

const p = new Promise((resolve, reject) => {
    resolve(100);
});
const p1 = async function() {
  try {
    await new Promise((resolve, reject) => {
        resolve(100);
    });
  } catch(e){}
}