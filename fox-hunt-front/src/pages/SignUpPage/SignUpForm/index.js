import React from 'react';
import { Button, SvgIcon } from '@mui/material';
import GoogleIcon from 'src/icons/googleIcon';
import { googleUrl } from 'src/store/actions/authActions';

const SignUpForm = ({ setRegistrationFormState }) => {
  const openRegistrationForm = () => {
    setRegistrationFormState(true);
  };

  const description = (
    <>
      In order to finish registration, we&apos;ll need
      <br /> some information about you.
      <br /> Please choose the most appropriate way for you:
    </>
  );

  return (
    <>
      <div className="text-center mb-5 gray-dark text-less-muted">
        <span>{description}</span>
      </div>
      <div className="text-center">
        <Button
          variant="contained"
          color="primary"
          onClick={openRegistrationForm}
          sx={{ mr: 1 }}
        >
          Sign up
        </Button>
        <Button
          variant="contained"
          color="grey"
          href={googleUrl}
          rel="noopener noreferrer"
        >
          <SvgIcon sx={{ marginRight: '1rem' }}>
            <GoogleIcon />
          </SvgIcon>
          Sign up with Google
        </Button>
      </div>
    </>
  );
};

export default SignUpForm;
