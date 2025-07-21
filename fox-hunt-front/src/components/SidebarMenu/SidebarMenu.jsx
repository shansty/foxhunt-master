import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { List, Typography } from '@mui/material';
import SidebarMenuListItem from './SidebarMenuListItem';
import SidebarMenuButton from './SidebarMenuButton';

function SidebarMenuList(props) {
  const location = useLocation();
  const path = location.pathname;
  const { pages, ...rest } = props;

  return (
    <List className="p-0">
      {pages.reduce(
        (items, page) => reduceChildRoutes({ items, page, path, ...rest }),
        [],
      )}
    </List>
  );
}

SidebarMenuList.propTypes = {
  depth: PropTypes.number,
  pages: PropTypes.array,
};

const checkIfChildrenMatchPath = (pages, path) =>
  pages.some((page) => {
    if (page.content) {
      return page.content.some((item) => matchPath(path, item.to));
    }
    return page.to === path;
  });

const reduceChildRoutes = (props) => {
  const { items, page, path, depth } = props;
  const hasLinkToPage = !!page.to;
  const hasChildren = !!page.content;

  const uniqueKey = page.key || page.to || `${page.label}-${depth}`;

  const defaultProps = {
    depth: depth,
    icon: page.icon,
    label: page.badge,
    title: page.label,
  };
  let newItem;

  if (hasChildren) {
    const matchesPath = checkIfChildrenMatchPath(page.content, path);

    newItem = (
      <SidebarMenuListItem
        key={uniqueKey}
        isOpen={matchesPath}
        isNested={hasChildren}
        {...defaultProps}
      >
        <div className="sidebar-menu-children">
          <SidebarMenuList depth={depth + 1} pages={page.content} />
        </div>
      </SidebarMenuListItem>
    );

    return [...items, newItem];
  }

  newItem = hasLinkToPage ? (
    <SidebarMenuListItem key={uniqueKey} href={page.to} {...defaultProps} />
  ) : (
    <SidebarMenuButton key={uniqueKey} {...defaultProps} />
  );

  return [...items, newItem];
};

function SidebarMenu(props) {
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

SidebarMenu.propTypes = {
  className: PropTypes.string,
  component: PropTypes.any,
  pages: PropTypes.array.isRequired,
  title: PropTypes.string,
};

SidebarMenu.defaultProps = {
  component: 'nav',
};

export default SidebarMenu;
