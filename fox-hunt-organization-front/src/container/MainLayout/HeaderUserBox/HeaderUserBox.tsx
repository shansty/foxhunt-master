import React, { Fragment } from 'react';

import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Menu,
} from '@mui/material';

import avatar5 from '../../../theme/assets/images/avatars/avatar5.jpg';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { connect } from 'react-redux';
import { logOut } from '../../../store/actions/authActions';

interface HeaderUserBoxProps {
  logOut: () => void;
}

function HeaderUserBox(props: HeaderUserBoxProps) {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Button
        color="inherit"
        onClick={handleClick}
        className="text-capitalize px-3 text-left btn-inverse d-flex align-items-center"
      >
        <Box>
          <Avatar sizes="44" alt="Emma Taylor" src={avatar5} />
        </Box>
        <div className="d-none d-xl-block pl-3">
          <div className="font-weight-bold pt-2 line-height-1">
            Alexander Belyaev
          </div>
          <span className="text-white-50">System Administrator</span>
        </div>
        <span className="pl-1 pl-xl-3">
          <ExpandLessIcon
            className="sidebar-expand-icon sidebar-expand-icon-rotate"
            color="inherit"
          />
        </span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        // getContentAnchorEl={null}
        open={Boolean(anchorEl)}
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
              <Avatar sizes="44" alt="Emma Taylor" src={avatar5} />
            </Box>
            <div className="pl-3  pr-3">
              <div className="font-weight-bold text-center pt-2 line-height-1">
                Alexander Belyaev
              </div>
              <span className="text-black-50 text-center">
                System Administrator
              </span>
            </div>
            <Divider className="w-100 mt-2" />
            <ListItem button onClick={props.logOut}>
              Log Out
            </ListItem>
          </List>
        </div>
      </Menu>
    </Fragment>
  );
}

const mapDispatchToProps = (dispatch: any) => ({
  logOut: () => dispatch(logOut()),
});

export default connect(null, mapDispatchToProps)(HeaderUserBox);
