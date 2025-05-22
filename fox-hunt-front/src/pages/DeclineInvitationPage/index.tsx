import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Button, TextField } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import OuterAppLayout from 'src/layouts/OuterAppLayout';
import {
  selectInvitation,
  selectUserInvitationError,
} from 'src/store/selectors/authSelectors';
import { declineInvitationLoaderSelector } from 'src/store/selectors/loadersSelector';
import {
  isInvitationValid,
  refreshToken,
  setDeclinedReason,
} from 'src/store/actions/authActions';
import { buildTokenInvalidUrl } from 'src/api/utils/navigationUtil';
import { signOutRequired } from 'src/hocs/permissions';
import { ERRORS } from 'src/constants/commonConst';

const styles = {
  textInput: {
    minWidth: '280px',
    marginBottom: '40px',
  },
  cancelBtn: {
    color: '#466fd8',
    fontWeight: '500',
    marginTop: '12px',
  },
  sendBtn: {
    width: '100px',
    marginLeft: '8px',
    marginTop: '-10px',
  },
};

interface DeclineForm {
  reason: string;
}

const DeclineInvitation = () => {
  const [isSubmittedForm, setSubmittedForm] = useState(false);
  const invitation = useAppSelector(selectInvitation);
  const error = useAppSelector(selectUserInvitationError);
  const isLoading = useAppSelector(declineInvitationLoaderSelector);
  const initialValues: DeclineForm = {
    reason: '',
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object().shape({
    reason: Yup.string().required(ERRORS.REQUIRED_FIELD),
  });

  useEffect(() => {
    dispatch(isInvitationValid(window.location.pathname));
  }, [isInvitationValid]);

  useEffect(() => {
    if (error) navigate(buildTokenInvalidUrl());
  }, [error]);

  const title = 'Invitation declined';
  const description = (
    <>
      Sorry to hear that. Could you describe
      <br /> the reason to reject an invitation?
    </>
  );

  const handleCancelClick = () => {
    setSubmittedForm(true);
  };

  const onSubmit = (
    values: DeclineForm,
    actions: FormikHelpers<DeclineForm>,
  ) => {
    const reason: { declinationReason: string } = {
      declinationReason: values.reason,
    };
    dispatch(setDeclinedReason({ reason, token: invitation.token }));
    actions.setSubmitting(false);
    setSubmittedForm(true);
  };

  return (
    <>
      {!error && !isLoading && (
        <OuterAppLayout title={title} description={undefined} image={undefined}>
          <div className="text-center mb-5 gray-dark text-less-muted">
            <span>
              {isSubmittedForm ? `Sorry to hear that.` : description}{' '}
            </span>
          </div>
          {!isSubmittedForm && (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(props: any) => (
                <form onSubmit={props.handleSubmit}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="Reason"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.reason}
                    name="reason"
                    style={styles.textInput}
                    variant="standard"
                    helperText={props.errors.reason}
                    error={props.errors.reason}
                  />
                  <div className="text-center">
                    <Button
                      variant="contained"
                      style={styles.sendBtn}
                      color="primary"
                      sx={{ mr: 1 }}
                      type={'submit'}
                    >
                      Send
                    </Button>
                    <div className="text-center">
                      <Button
                        style={styles.cancelBtn}
                        sx={{ color: 'inherit' }}
                        onClick={handleCancelClick}
                      >
                        Don’t Send
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          )}
        </OuterAppLayout>
      )}
    </>
  );
};

export default signOutRequired(DeclineInvitation);
