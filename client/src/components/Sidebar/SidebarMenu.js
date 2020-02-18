import React from 'react';
import {Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import {useHistory} from 'react-router-dom';
import sidebarMenuList from 'config/sidebarMenu';

export default function SidebarMenu() {
  let history = useHistory();

  const items = sidebarMenuList.map((item) => 
    (item.divider) ? 
      <MenuDivider
        title={item.title} /> : 
      <MenuItem
        icon={item.icon}
        text={item.text}
        label={item.label}
        disabled={item.disabled}
        onClick={() => { history.push(item.href); }} />
  );
  return (
    <Menu className="sidebar-menu">
      {items}
    </Menu>
  )
};
