import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  DialogContent,
  DialogContentText,
  Dialog,
  Button,
  MenuItem,
  OutlinedInput,
  InputLabel,
  Select,
} from '@mui/material';
import {
  StyledTitle,
  StyledFormControl,
  StyledTextField,
  ErrorMessage,
  FormActions,
} from './styles';
import { getUsers, inviteUsers } from '../../store/actions/usersActions';
import { COACH, PARTICIPANT } from '../../constants/roles';
import { enumStringToReadableFormat } from '../../utils/formatUtil';
import MultiTextInput from '../../components/FormElements/MultiTextInput';
import useEmailValidation from '../../hooks/useEmailValidation';

const NO_ERROR = '';
const SUCCESS_SENDING_STATUS = 200;

function InviteUserContainer({ handleClickClose, pager, isOpen, userRoles }) {
  const dispatch = useDispatch();

  const userCanGrantMultipleRoles = () =>
    userRoles.find((role) => role.match(/ADMIN/gi));

  const roleInitialValue = () =>
    userCanGrantMultipleRoles() ? [] : [PARTICIPANT];

  const [emails, setEmails] = useState([]);
  const [roles, setRole] = useState(roleInitialValue);
  const [error, setError] = useState(' ');
  const [isSending, setIsSending] = useState(false);

  const handleRoleChange = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setRole(typeof value === 'string' ? value.split(',') : value);
    setError(NO_ERROR);
  }, []);

  const handleEmailsChange = useCallback((emails) => {
    setEmails(emails);
    setError(NO_ERROR);
  }, []);

  const validateFieldsOnSubmit = useCallback(() => {
    if (!roles.length && !emails.length) {
      setError('Please, enter one or more emails and choose role');
    } else if (!roles.length) {
      setError('Please, choose role');
    } else if (!emails.length) {
      setError('Please, enter one or more emails');
    } else {
      return true;
    }
  }, [emails, roles]);

  const onSubmit = useCallback(async () => {
    const isValid = validateFieldsOnSubmit();
    if (!isValid) return;
    setIsSending(true);

    dispatch(inviteUsers({ emails, roles })).then(({ payload }) => {
      if (payload.status === SUCCESS_SENDING_STATUS) {
        handleClickClose();
        dispatch(
          getUsers({
            page: pager.page,
            size: pager.rowsPerPage,
          }),
        );
      } else {
        setIsSending(false);
      }
    });
  }, [
    dispatch,
    handleClickClose,
    emails,
    pager,
    roles,
    validateFieldsOnSubmit,
  ]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClickClose}
      aria-labelledby="alert-dialog-title"
    >
      <StyledTitle>
        <span>Invite new users</span>
      </StyledTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          To invite new users, please, enter their emails and choose their role.
        </DialogContentText>
        <MultiTextInput
          onChange={handleEmailsChange}
          validateValue={useEmailValidation}
          placeholder="Emails"
        />
        <StyledFormControl fullWidth variant="outlined" size="small">
          {userCanGrantMultipleRoles() ? (
            <>
              <InputLabel>Role</InputLabel>
              <Select
                value={roles}
                onChange={handleRoleChange}
                input={<OutlinedInput label="Role" />}
                multiple
                data-testid="select-area"
                size="small"
              >
                <MenuItem value={COACH}>
                  {enumStringToReadableFormat(COACH)}
                </MenuItem>
                <MenuItem value={PARTICIPANT}>
                  {enumStringToReadableFormat(PARTICIPANT)}
                </MenuItem>
              </Select>
            </>
          ) : (
            <StyledTextField
              disabled
              label="Role"
              value={enumStringToReadableFormat(PARTICIPANT)}
              size="small"
            />
          )}
          <ErrorMessage>{error}</ErrorMessage>
        </StyledFormControl>
        <FormActions>
          <Button
            sx={{ mr: 1 }}
            onClick={handleClickClose}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            type="submit"
            variant="contained"
            color="primary"
            data-testid="submit-button"
          >
            {isSending ? 'Sending..' : 'Submit'}
          </Button>
        </FormActions>
      </DialogContent>
    </Dialog>
  );
}

InviteUserContainer.propTypes = {
  handleClickClose: PropTypes.func.isRequired,
  pager: PropTypes.shape({
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  userRoles: PropTypes.array.isRequired,
};

export default InviteUserContainer;
