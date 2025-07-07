import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Menu,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logOut } from '../../store/actions/authActions';
import { createStructuredSelector } from 'reselect';
import UserOrganizationContainer from '../../containers/UserOrganizationContainer';
import _ from 'lodash';
import {
  selectUserManageMultipleOrganizations,
  selectLoggedUser,
} from '../../store/selectors/authSelectors';
import {
  HEADER_ITEM_HELP,
  HEADER_ITEM_MY_ORGANIZATION,
  HEADER_ITEM_MY_PROFILE,
  HEADER_ITEM_SIGN_OUT,
  HEADER_ITEM_SWITCH_ORGANIZATION,
} from '../../utils/CommonConstants';
import { sortUsersRolesByRights } from '../../utils/formatUtil';
import {
  buildOrganizationSwitchUrl,
  buildProfileUrl,
} from '../../api/utils/navigationUtil';
import Popup from '../UI/Popup';
import { userLoaderSelector } from 'src/store/selectors/loadersSelector';

const HeaderUserBox = (props) => {
  !props.isUserLoading && sortUsersRolesByRights(_.get(props, 'user', ''));
  const userFirstName = _.get(props, 'user.firstName', '');
  const userLastName = _.get(props, 'user.lastName', '');
  const userManageMultipleOrganizations = _.get(
    props,
    'userManageMultipleOrganizations',
  );
  const userAvatar = _.get(props, 'user.avatar', '');
  let userRole = _.get(props, 'user.roles[0].role', '')
    .replaceAll('_', ' ')
    .toLowerCase();
  userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [organizationAnchorEl, setOrganizationAnchorEl] = useState(null);
  const [switchAnchorEl, setSwitchAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const isOrgPopperOpen = !!anchorEl && !!organizationAnchorEl;

  const handleClick = (event) => {
    setOrganizationAnchorEl(null);
    setAnchorEl(event.currentTarget);
  };

  const goToMyProfile = () => {
    navigate(buildProfileUrl());
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(!anchorEl);
  };

  const handleCloseOrganizationPopup = () => {
    setOrganizationAnchorEl(!organizationAnchorEl);
  };

  const goToMyOrganization = (event) => {
    setSwitchAnchorEl(null);

    if (organizationAnchorEl) {
      setOrganizationAnchorEl(!organizationAnchorEl);
    } else {
      setOrganizationAnchorEl(event.currentTarget);
    }
  };

  const goToOrganizationSwitch = () => {
    window.open(buildOrganizationSwitchUrl(), '_blank');
    handleClose();
  };

  return (
    <Fragment>
      <Button
        color="inherit"
        onClick={handleClick}
        className="text-capitalize px-3 text-left btn-inverse d-flex align-items-center"
      >
        <Box>
          <Avatar
            sizes="44"
            alt={`${userFirstName} ${userLastName}`}
            src={userAvatar}
          />
        </Box>
        <div className="d-none d-lg-block pl-3">
          <div className="font-weight-bold pt-2 line-height-1 text-white">
            {`${userFirstName} ${userLastName}`}
          </div>
          <span className="text-white-50">{userRole}</span>
        </div>
        <span className="pl-1 pl-xl-3 text-white">
          <ExpandLessIcon
            className="sidebar-expand-icon sidebar-expand-icon-rotate"
            color="inherit"
          />
        </span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        disableEnforceFocus
        open={!!anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={handleClose}
        className="ml-2"
      >
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="text-left bg-transparent d-flex align-items-center flex-column pt-0">
            <Box>
              <Avatar
                sizes="44"
                alt={`${userFirstName} ${userLastName}`}
                src={userAvatar}
              />
            </Box>
            <div className="pl-3 pr-3 text-center">
              <div className="font-weight-bold pt-2 line-height-1">
                {`${userFirstName} ${userLastName}`}
              </div>
              <span className="text-black-50">{userRole}</span>
            </div>
            <Divider className="w-100 mt-2" />
            <ListItem button onClick={goToMyProfile}>
              {HEADER_ITEM_MY_PROFILE}
            </ListItem>
            <ListItem
              button
              onClick={goToMyOrganization}
              selected={!!organizationAnchorEl}
            >
              {HEADER_ITEM_MY_ORGANIZATION}
            </ListItem>
            <ListItem button>{HEADER_ITEM_HELP}</ListItem>
            <Divider className="w-100 mt-2" />
            {userManageMultipleOrganizations && (
              <ListItem
                button
                selected={!!switchAnchorEl}
                onClick={goToOrganizationSwitch}
              >
                {HEADER_ITEM_SWITCH_ORGANIZATION}
              </ListItem>
            )}
            <ListItem button onClick={props.logOut}>
              {HEADER_ITEM_SIGN_OUT}
            </ListItem>
          </List>
        </div>
      </Menu>

      <Popup
        isOpen={isOrgPopperOpen}
        handleClose={handleCloseOrganizationPopup}
        anchor={organizationAnchorEl}
        arrow={arrowRef}
        setArrow={setArrowRef}
        content={<UserOrganizationContainer />}
      />
    </Fragment>
  );
};

HeaderUserBox.propTypes = {
  logOut: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  user: selectLoggedUser,
  userManageMultipleOrganizations: selectUserManageMultipleOrganizations,
  isUserLoading: userLoaderSelector,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUserBox);
