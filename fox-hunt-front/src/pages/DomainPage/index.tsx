import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  DomainValueType,
  domainInitialValue,
  domainValidationSchema,
} from 'src/api/utils/domainUtils';
import { setDefaultError } from 'src/store/slices/authSlice';
import { checkDomain } from 'src/store/actions/authActions';
import { signOutRequired } from 'src/hocs/permissions';
import OuterAppLayout from 'src/layouts/OuterAppLayout';
import DomainForm from 'src/components/DomainForm';
import illustration from 'src/theme/assets/images/illustrations/login.svg';
import { FormikHelpers, FormikValues } from 'formik';

function DomainPage() {
  const dispatch = useDispatch();
  const submitButtonLabel = 'Next';
  const title = (
    <>
      Please, enter your organization
      <br /> domain to continue
    </>
  );
  const description = 'Enter the domain name';

  const onSubmit = (
    values: FormikValues,
    { setSubmitting }: FormikHelpers<DomainValueType>,
  ) => {
    setSubmitting(false);
    dispatch(checkDomain(values.domain));
  };

  useEffect(() => {
    dispatch(setDefaultError());
  }, [dispatch]);

  return (
    <OuterAppLayout
      title={title}
      description={description}
      image={illustration}
    >
      <DomainForm
        onSubmit={onSubmit}
        initialValues={domainInitialValue}
        validationSchema={domainValidationSchema}
        submitButtonLabel={submitButtonLabel}
      />
    </OuterAppLayout>
  );
}

export default signOutRequired(DomainPage);
