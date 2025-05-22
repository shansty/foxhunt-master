import React, { forwardRef, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import { Button, Collapse, ListItem } from '@mui/material';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface CustomRouterLinkProps {
  children?: React.ReactNode;
  className?: string;
  depth: number;
  href?: string;
  icon?: any;
  label?: any;
  open?: boolean;
  to?: any;
  title: string;
}

const CustomRouterLink = forwardRef(function CustomLink(props: any, ref: any) {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} style={{ flexGrow: 1 }}>
      <RouterLink
        {...rest}
        className={({ isActive }) =>
          isActive ? clsx('active-item', className) : className
        }
      >
        {children}
      </RouterLink>
    </div>
  );
});

function SidebarMenuListItem({
  depth = 0,
  open: openProp = false,
  ...props
}: CustomRouterLinkProps) {
  const {
    title,
    href,
    children,
    icon: Icon,
    className,
    label: Label,
    ...rest
  } = props;
  const [open, setOpen] = useState(openProp);

  const handleToggle = () => {
    setOpen((open: any) => !open);
  };

  let paddingLeft = 22;

  if (depth > 0) {
    paddingLeft = 16 + 20 * depth;
  }
  const style = {
    paddingLeft,
  };

  if (children) {
    return (
      <ListItem
        {...rest}
        className={clsx('app-sidebar-item', className)}
        disableGutters
      >
        <Button
          color="primary"
          className={clsx('app-sidebar-button', { active: open })}
          onClick={handleToggle}
          style={style}
        >
          <span>{title}</span>
          {open ? (
            <ExpandLessIcon className="sidebar-expand-icon" color="inherit" />
          ) : (
            <ExpandLessIcon
              className="sidebar-expand-icon sidebar-expand-icon-rotate"
              color="inherit"
            />
          )}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  } else {
    return (
      <ListItem
        {...rest}
        className={clsx('app-sidebar-item app-sidebar-button', className)}
        disableGutters
      >
        <Button
          color="primary"
          disableRipple
          variant="text"
          className={clsx('app-sidebar-button-wrapper')}
          component={CustomRouterLink}
          end
          style={style}
          to={href}
        >
          {Icon && <Icon className="app-sidebar-icon" />}
          {title}
          {Label && (
            <span className="menu-item-label">
              <Label />
            </span>
          )}
        </Button>
      </ListItem>
    );
  }
}

export default SidebarMenuListItem;
