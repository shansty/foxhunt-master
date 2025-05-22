import React, { forwardRef, useState, useMemo } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, Collapse, ListItem } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getSideBarMenuPadding } from '../../utils/stylesUtil';

const CustomRouterLink = forwardRef(function CustomLink(props, ref) {
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

function SidebarMenuListItem(props) {
  const {
    title,
    href,
    depth,
    children,
    icon: Icon,
    className,
    isOpen,
    isNested,
    label: Label,
    ...rest
  } = props;

  const [isItemExpanded, setIsItemExpanded] = useState(isOpen);
  const styles = useMemo(() => getSideBarMenuPadding(depth), [depth]);

  const handleToggle = () => {
    setIsItemExpanded((open) => !open);
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
          className={clsx('app-sidebar-button', { active: isOpen })}
          onClick={handleToggle}
          style={styles}
        >
          <span>{title}</span>
          {isNested &&
            (isItemExpanded ? (
              <ExpandLessIcon className="sidebar-expand-icon" color="inherit" />
            ) : (
              <ExpandLessIcon
                className="sidebar-expand-icon sidebar-expand-icon-rotate"
                color="inherit"
              />
            ))}
        </Button>
        {isNested && <Collapse in={isItemExpanded}>{children}</Collapse>}
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
          style={styles}
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

SidebarMenuListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.any,
  label: PropTypes.any,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

SidebarMenuListItem.defaultProps = {
  depth: 0,
  open: false,
};

export default SidebarMenuListItem;
