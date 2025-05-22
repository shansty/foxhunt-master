import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { List, Typography } from '@mui/material';
import SidebarMenuListItem from './SidebarMenuListItem';

export interface Page {
  label: string;
  content?: { label: string; content: undefined; to: string }[];
  to?: string;
  icon?: any;
  badge?: any;
}

interface SidebarMenuListProps {
  pages: Page[];
  depth: number;
}

interface SidebarMenuProps {
  className?: string;
  component?: any;
  pages: Page[];
  title?: string;
}

interface reduceChildRoutesProps {
  page: Page;
  depth: number;
  items: any[];
}

function SidebarMenuList(props: SidebarMenuListProps) {
  const { pages, ...rest } = props;

  return (
    <List className="p-0">
      {pages.reduce(
        (items: any, page: any) => reduceChildRoutes({ items, page, ...rest }),
        [],
      )}
    </List>
  );
}

function reduceChildRoutes(props: reduceChildRoutesProps) {
  const { items, page, depth } = props;
  const location = useLocation();

  if (page.content) {
    const open = page.content.some((subpage: any) =>
      matchPath(location.pathname, subpage.to),
    );

    items.push(
      <SidebarMenuListItem
        depth={depth}
        icon={page.icon}
        key={page.label}
        label={page.badge}
        open={Boolean(open)}
        title={page.label}
      >
        <div className="sidebar-menu-children py-2">
          <SidebarMenuList depth={depth + 1} pages={page.content} />
        </div>
      </SidebarMenuListItem>,
    );
  } else {
    items.push(
      <SidebarMenuListItem
        depth={depth}
        href={page.to}
        icon={page.icon}
        key={page.label}
        label={page.badge}
        title={page.label}
      />,
    );
  }

  return items;
}

function SidebarMenu(props: SidebarMenuProps) {
  const { title, pages, className, component: Component, ...rest } = props;

  return (
    <Component {...rest} className={className}>
      {title && (
        <Typography className="app-sidebar-heading">{title}</Typography>
      )}
      <SidebarMenuList depth={0} pages={pages} />
    </Component>
  );
}

SidebarMenu.defaultProps = {
  component: 'nav',
};

export default SidebarMenu;
