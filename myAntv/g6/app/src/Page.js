/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-05-01 21:49:16
 * @LastEditors: liang
 * @LastEditTime: 2020-05-01 22:14:30
 */
import React from "react";
import Aside from "./components/Aside";

export default function Page(props) {
  const { pathname } = props.location;
  const { pages, files } = props;
  const page = pages[pathname.replace("/", "")];
  const { default: Component } = page;
  if (Component)
    return (
      <>
        <Aside files={files} location={props.location} />
        <div className="content">
          <Component />
        </div>
      </>
    );
  return null;
}
