import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

const Page = (props) => {
  const { name, path, className } = props;
  const linkClassName = clsx('page', className);
  const navLinkClassName = ({ isActive }) =>
    linkClassName + (isActive ? 'my-active' : '');

  const activeStyle = {
    color: 'purple',
    textDecoration: 'underline',
    font: 'bold',
  };
  const navLinkStyle = ({ isActive }) => ({
    color: isActive && activeStyle,
  });

  return (
    <NavLink to={path} className={navLinkClassName} style={navLinkStyle}>
      <span>{name}</span>
    </NavLink>
  );
};

Page.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  icon: PropTypes.object,
  className: PropTypes.string,
};

export default Page;
