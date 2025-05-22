import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getOrganizationAdmin,
  loadCurrentOrganization,
} from '../../store/actions/authActions';
import {
  selectCurrentOrganization,
  selectCurrentOrganizationAdmin,
} from '../../store/selectors/authSelectors';
import CardContent from '@mui/material/CardContent';
import { Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const UserOrganizationContainer = ({
  organization,
  organizationAdmin,
  loadCurrentOrganization,
  loadOrganizationAdmin,
}) => {
  useEffect(() => {
    loadCurrentOrganization();
    loadOrganizationAdmin();
  }, []);

  return (
    <>
      <CardContent>
        <Grid container direction={'column'} spacing={2}>
          <Grid item>
            <Typography variant={'h3'} color={'primary'}>
              {organization.name}
            </Typography>
          </Grid>
          <Divider className="w-100 mt-2" />
          <Grid item>
            <Typography variant={'subtitle1'}>
              Domain: {organization.organizationDomain}
            </Typography>
          </Grid>
          {organization.legalAddress && (
            <Grid item>
              <Typography variant={'subtitle1'}>
                Legal address: {organization.legalAddress}
              </Typography>
            </Grid>
          )}
          {organization.approximateEmployeesNumber && (
            <Grid item>
              <Typography variant={'subtitle1'}>
                Employees: {organization.approximateEmployeesNumber}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <Typography variant={'subtitle1'}>
              Admin:{' '}
              {`${organizationAdmin.lastName} ${organizationAdmin.firstName}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant={'subtitle1'}>
              Admin email: {organizationAdmin.email}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

UserOrganizationContainer.propTypes = {
  organization: PropTypes.shape({
    name: PropTypes.string.isRequired,
    organizationDomain: PropTypes.string.isRequired,
    legalAddress: PropTypes.string,
    approximateEmployeesNumber: PropTypes.number,
  }),
  organizationAdmin: PropTypes.shape({
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

UserOrganizationContainer.defaultProps = {
  organization: {
    name: '',
    organizationDomain: '',
  },
  organizationAdmin: {
    lastName: '',
    firstName: '',
    email: '',
  },
};

const mapStateToProps = createStructuredSelector({
  organization: selectCurrentOrganization,
  organizationAdmin: selectCurrentOrganizationAdmin,
});

const mapDispatchToProps = (dispatch) => ({
  loadCurrentOrganization: () => dispatch(loadCurrentOrganization()),
  loadOrganizationAdmin: () => dispatch(getOrganizationAdmin()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserOrganizationContainer);
