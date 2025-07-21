import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { signOutRequired } from 'src/hocs/permissions';
import { DIV_CLASS_NAME, HEADING_CLASS_NAME } from '../styles';
import illustration from 'src/theme/assets/images/illustrations/token.svg';
import { selectUserInvitationError } from 'src/store/selectors/authSelectors';

const DEFAULT_ERROR_MESSAGE = 'Sorry, your invitation is invalid.';

function TokenInvalidPage(props) {
  return (
    <div className={DIV_CLASS_NAME}>
      <img
        alt="invalid token"
        className="w-50 mx-auto d-block my-5 img-fluid"
        src={illustration}
      />
      <h3 className={HEADING_CLASS_NAME}>
        {props.error || DEFAULT_ERROR_MESSAGE}
      </h3>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  error: selectUserInvitationError,
});

export default signOutRequired(connect(mapStateToProps)(TokenInvalidPage));
