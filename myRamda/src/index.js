import * as R from "ramda";
function component() {
  let element = document.createElement("div");
  element.innerHTML = R.all(x => x > 1)([1, 2]);
  return element;
}

document.body.appendChild(component());
