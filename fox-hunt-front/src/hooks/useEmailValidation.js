import { validateEmail } from '../utils/validators';
import { ERRORS } from '../constants/commonConst';

const useEmailValidation = (email, allEmails) => {
  if (!email) {
    return;
  }
  const isEmail = validateEmail(email);
  const isLengthValid = email.length <= 40;
  if (!isEmail) {
    return ERRORS.INVALID_EMAIL;
  }
  if (!isLengthValid) {
    return ERRORS.TOO_LONG_EMAIL;
  }
  if (allEmails.length > 0 && allEmails.includes(email)) {
    return ERRORS.REPEATED_EMAIL;
  }
};

export default useEmailValidation;
