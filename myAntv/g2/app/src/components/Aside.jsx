import React from "react";
import { Link } from "react-router-dom";
function Aside({ files, ...props }) {
  const { pathname } = props.location;
  return (
    <aside>
      <ul>
        {Object.entries(files).map(([filename, menuName]) => (
          <li
            key={filename}
            className={pathname.replace("/", "") === filename ? "active" : ""}
          >
            <Link to={filename}>{menuName}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
export default Aside;
