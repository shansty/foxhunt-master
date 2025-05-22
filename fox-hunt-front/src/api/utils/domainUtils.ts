import * as Yup from 'yup';
import { ENGLISH_LETTERS_ONLY_REGEX } from '../../utils/validators';
import { ERRORS } from 'src/constants/commonConst';

export interface DomainValueType {
  domain: string;
}

export const domainInitialValue: DomainValueType = {
  domain: '',
};

export const domainValidationSchema = Yup.object().shape({
  domain: Yup.string()
    .required(ERRORS.REQUIRED_FIELD)
    .min(2)
    .max(50)
    .matches(ENGLISH_LETTERS_ONLY_REGEX),
});
