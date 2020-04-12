import fp from "lodash/fp";
function component() {
  let element = document.createElement("div");
  element.onclick = () => {
    console.log(1);
    fp.after(x => console.log(x));
  };
  fp.forEach();
  element.innerHTML = fp.every(1)(false);
  return element;
}

document.body.appendChild(component());
