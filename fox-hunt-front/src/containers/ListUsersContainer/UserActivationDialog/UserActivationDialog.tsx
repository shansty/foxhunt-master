import React, { useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import StyledWarningIcon from './styles';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '../../../store/selectors/authSelectors';
import * as roles from '../../../constants/roles';
import { User, Role } from 'src/types/User';
import { enumStringToReadableFormat } from 'src/utils/formatUtil';
import { RolesEnum } from 'src/utils/types/roleTypes';

const WARNING_MESSAGES = {
  [roles.ADMIN]: `Since you are an organization admin you have no possibility to deactivate yourself. 
     Please, send a request to change the organization admin first.`,
  [roles.COACH]: `After deactivation you will not be able to reactivate the account on your own. 
     In order to do that, please, contact the admin of your organization.`,
};

const DEACTIVATE_USER = {
  TITLE: 'Deactivate user',
  TEXT: 'Please confirm deactivation of',
};

const ACTIVATE_USER = {
  TITLE: 'Activate user',
  TEXT: 'Please confirm activation of',
};

const getAlertTitle = (user: User) =>
  user.activated ? DEACTIVATE_USER.TITLE : ACTIVATE_USER.TITLE;

const getAlertText = ({
  firstName = '',
  lastName = '',
  email = '',
  activated = false,
}: {
  firstName: string;
  lastName: string;
  email: string | undefined;
  activated: any;
}) => {
  const textToDisplay = firstName ? `${firstName} ${lastName}` : email;
  return `${
    activated ? DEACTIVATE_USER.TEXT : ACTIVATE_USER.TEXT
  } ${textToDisplay}`;
};

const UserActivationDialog = ({
  user,
  onClose,
  onSubmit,
  userRoles,
  setRoles,
}: {
  user: User;
  onClose: () => void;
  onSubmit: () => void;
  userRoles: RolesEnum[];
  setRoles: (role: any) => void;
}) => {
  const currentUser = useSelector(selectLoggedUser);
  const currentUserRoles = useMemo(
    () => currentUser.roles.map((roleObj: Role) => roleObj.role),
    [currentUser],
  );

  const getUserWarning = () => {
    if (currentUserRoles.includes(roles.ADMIN)) {
      return WARNING_MESSAGES[roles.ADMIN];
    } else {
      return WARNING_MESSAGES[roles.COACH];
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<RolesEnum[]>) => {
    const {
      target: { value },
    } = event;
    typeof value !== 'string' && setRoles(value);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{getAlertTitle(user)}</DialogTitle>
      <DialogContent>
        {!(user.id === currentUser.id) && (
          <DialogContentText id="alert-dialog-description">
            {getAlertText(user)}
          </DialogContentText>
        )}
        {!user.activated && (
          <FormControl
            margin="dense"
            fullWidth
            required
            error={userRoles?.length === 0}
          >
            <InputLabel>Role</InputLabel>
            <Select
              value={userRoles}
              label="Role"
              multiple
              onChange={handleRoleChange}
              disabled={!currentUserRoles.includes(roles.ADMIN)}
            >
              <MenuItem value={roles.COACH}>
                {enumStringToReadableFormat(roles.COACH)}
              </MenuItem>
              <MenuItem value={roles.PARTICIPANT}>
                {enumStringToReadableFormat(roles.PARTICIPANT)}
              </MenuItem>
            </Select>
          </FormControl>
        )}
        {user.id === currentUser.id && (
          <DialogContentText>
            <StyledWarningIcon />
            {getUserWarning()}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {!(
          currentUserRoles.includes(roles.ADMIN) && user.id === currentUser.id
        ) && (
          <Button
            onClick={onSubmit}
            color="primary"
            autoFocus
            disabled={userRoles?.length === 0 && !user.activated}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UserActivationDialog;
