import React, { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import * as organizationActions from '../store/actions/organizationActions';
import { emptyStringsToNull, enumStringToReadableFormat } from '../utils/utils';
import { connect } from 'react-redux';
import { Form as FormikForm, Formik, FormikHelpers } from 'formik';
import { Alert } from '@mui/lab';
import * as Yup from 'yup';
import {
  selectError,
  selectOrganization,
  selectOrganizationLoadingState,
} from '../store/selectors/orgnizationSelectors';
import { FormikInput } from 'common-front';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { TextField } from 'formik-mui';
import { organizationTypeEnum } from '../utils/enums';
import { FormikSimpleSelect } from 'common-front';
import { isNil, omit } from 'lodash';
import { useParams } from 'react-router-dom';
import {
  Organization,
  OrganizationFormType,
  UpdateOrganizationType,
} from '../types/Organization';
import {
  DEFAULT_ORGANIZATION_FORM_VALUES,
  REQUIRED_FIELD,
  INVALID_EMAIL,
  EMAIL_REGEX,
} from '../utils/commonConstants';
import { OrganizationDispatch } from '../types/Dispatch';

interface OrganizationFormProps {
  organization?: Organization;
  error: string | null;
  isLoading: boolean;
  fetchOrganizationById(id: string): void;
  updateOrganization(org: UpdateOrganizationType): void;
  createOrganization(org: OrganizationFormType): void;
}

const OrganizationForm = ({
  organization,
  error,
  isLoading,
  fetchOrganizationById,
  updateOrganization,
  createOrganization,
}: OrganizationFormProps) => {
  const params = useParams();
  useEffect(() => {
    if (!isNil(params.id)) {
      fetchOrganizationById(params.id);
    }
  }, []);

  const ENGLISH_LETTERS_ONLY_REGEX = /^[a-zA-Z-_]+$/;
  const orgTypeReadableValues = Object.values(organizationTypeEnum).map((val) =>
    enumStringToReadableFormat(val),
  );
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(REQUIRED_FIELD).min(5).max(50),
    legalAddress: Yup.string().required(REQUIRED_FIELD).min(5).max(250),
    actualAddress: Yup.string().min(5).max(250).nullable(),
    organizationDomain: Yup.string()
      .matches(
        ENGLISH_LETTERS_ONLY_REGEX,
        'Domain must consist of only english letters',
      )
      .required(REQUIRED_FIELD),
    rootUserEmail: Yup.string()
      .matches(EMAIL_REGEX, INVALID_EMAIL)
      .required(REQUIRED_FIELD)
      .min(5)
      .max(50),
    approximateEmployeesNumber: Yup.number().min(1).nullable(),
    type: Yup.string()
      .required()
      .oneOf([...orgTypeReadableValues, '']),
  });

  function onSubmit(
    values: OrganizationFormType,
    { setSubmitting }: FormikHelpers<OrganizationFormType>,
  ) {
    values = emptyStringsToNull(values);
    values.type = values.type && values.type.toUpperCase();

    if (isEdit) {
      updateOrganization(omit(values, 'rootUserEmail', 'organizationDomain'));
    } else {
      createOrganization(values);
    }
    setSubmitting(false);
  }

  const isEdit = !!params.id;

  return !isLoading || isNil(params.id) ? (
    <>
      {!isNil(params.id) && organization
        ? (organization.type = enumStringToReadableFormat(organization.type))
        : null}
      <Formik
        initialValues={
          organization && !isNil(params.id)
            ? organization
            : DEFAULT_ORGANIZATION_FORM_VALUES
        }
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ errors, touched }) => (
          <Card variant={'outlined'}>
            <CardContent>
              <FormikForm noValidate>
                <Grid container direction={'column'} spacing={1}>
                  <Grid item container direction={'column'} spacing={1}>
                    <Grid item>
                      <Typography
                        className="text-black px-2 font-weight-bold"
                        component="div"
                      >
                        Main Information
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormikInput
                        component={TextField}
                        label="Name*"
                        name={'name'}
                        variant="outlined"
                        enableFeedback
                        fullWidth
                        error={touched.name ? !!errors.name : null}
                      />
                    </Grid>
                    <Grid item>
                      <FormikInput
                        disabled={isEdit}
                        component={TextField}
                        label="Organization domain*"
                        name={'organizationDomain'}
                        variant="outlined"
                        enableFeedback
                        fullWidth
                        error={
                          touched.organizationDomain
                            ? !!errors.organizationDomain
                            : null
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormikInput
                        component={FormikSimpleSelect}
                        name={'type'}
                        label={'Organization type*'}
                        items={orgTypeReadableValues}
                        variant={'outlined'}
                        enableFeedback
                        fullWidth
                        error={touched.type ? !!errors.type : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    direction={'row'}
                    spacing={1}
                    justifyContent={'center'}
                  >
                    <Grid
                      item
                      container
                      direction={'column'}
                      sm={6}
                      spacing={1}
                    >
                      <Grid item>
                        <Typography
                          className="text-black px-2 font-weight-bold"
                          component="div"
                        >
                          Contact information
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={TextField}
                          disabled={isEdit}
                          label="Admin email*"
                          placeholder="orgadmin@mail.com"
                          name={'rootUserEmail'}
                          variant="outlined"
                          enableFeedback
                          fullWidth
                          error={
                            touched.rootUserEmail
                              ? !!errors.rootUserEmail
                              : null
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={TextField}
                          label="Legal Address*"
                          name={'legalAddress'}
                          variant="outlined"
                          enableFeedback
                          fullWidth
                          error={
                            touched.legalAddress ? !!errors.legalAddress : null
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={TextField}
                          label="Actual address"
                          name={'actualAddress'}
                          variant="outlined"
                          enableFeedback
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      container
                      direction={'column'}
                      sm={6}
                      spacing={1}
                    >
                      <Grid item>
                        <Typography
                          className="text-black px-2 font-weight-bold"
                          component="div"
                        >
                          Extra information
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={TextField}
                          label="Approximate number of members"
                          name={'approximateEmployeesAmount'}
                          variant="outlined"
                          placeholder="0"
                          enableFeedback
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      type={'submit'}
                      fullWidth
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid item container justifyContent={'center'}>
                    {error && (
                      <Alert
                        style={{ width: 'fit-content' }}
                        severity={'error'}
                      >
                        {error}
                      </Alert>
                    )}
                  </Grid>
                </Grid>
              </FormikForm>
            </CardContent>
          </Card>
        )}
      </Formik>
    </>
  ) : null;
};

const mapStateToProps = createStructuredSelector({
  organization: selectOrganization,
  isLoading: selectOrganizationLoadingState,
  error: selectError,
});

const mapDispatchToProps = (dispatch: OrganizationDispatch) => ({
  createOrganization: (organization: OrganizationFormType) =>
    dispatch(organizationActions.createOrganization(organization)),
  updateOrganization: (organization: UpdateOrganizationType) =>
    dispatch(organizationActions.updateOrganization(organization)),
  fetchOrganizationById: (id: string) =>
    dispatch(organizationActions.fetchOrganizationById(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationForm);
