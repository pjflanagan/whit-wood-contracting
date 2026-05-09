import React, { ReactNode } from "react";

import Style from './style.module.scss';

type SidebarProps = {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <div className={Style['sidebar']} id="sidebar">
      <div className={Style['sidebar-strings']}>
        <div className={Style['string']}></div>
        <div className={Style['string']}></div>
        <div className={Style['string']}></div>
        <div className={Style['string']}></div>
      </div>
      <div className={Style['sidebar-content']}>{children}</div>
    </div>
  );
}
