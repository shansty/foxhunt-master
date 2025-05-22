import { EMAIL_REGEX } from 'src/constants/commonConst';

export const validateEmail = (email) => EMAIL_REGEX.test(email);
export const ENGLISH_LETTERS_ONLY_REGEX = /^[a-zA-Z-_]+$/;
