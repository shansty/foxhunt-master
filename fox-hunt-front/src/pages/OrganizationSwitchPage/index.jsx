import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import { DOMAIN } from 'src/store/constants/localStorageKeys';
import { buildWelcomePageUrl } from 'src/api/utils/navigationUtil';
import { switchDomain } from 'src/store/actions/authActions';
import { signInRequired } from 'src/hocs/permissions';
import { selectUserManageMultipleOrganizations } from 'src/store/selectors/authSelectors';
import NotFoundPage from 'src/pages/errors/NotFoundPage';
import { useIsMobile } from 'common-front';
import OuterAppLayout from 'src/layouts/OuterAppLayout';
import { CurrentDomain } from './styles';
import {
  domainInitialValue,
  domainValidationSchema,
} from 'src/api/utils/domainUtils';
import DomainForm from 'src/components/DomainForm';
import illustration from 'src/theme/assets/images/illustrations/best_place.svg';

function OrganizationSwitchPage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const currentDomain = localStorage.getItem(DOMAIN);
  const userManageMultipleOrganizations = useSelector(
    selectUserManageMultipleOrganizations,
  );
  const submitButtonLabel = 'Switch';
  const title = (
    <>
      Please, enter the domain of
      <br /> your target organization to switch
    </>
  );
  const description = 'Enter the domain name to switch';

  const onSubmit = (values) => {
    if (!values.domain.trim()) {
      return;
    }

    const payload = {
      domain: values.domain,
    };

    dispatch(switchDomain(payload)).then((response) => {
      if (response?.status === 200) {
        navigate(buildWelcomePageUrl());
      }
    });
  };

  const cancelOrganizationSwitch = () => {
    navigate(buildWelcomePageUrl());
  };

  if (!userManageMultipleOrganizations) {
    return <NotFoundPage />;
  }

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
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <CurrentDomain container direction={isMobile ? 'row-reverse' : 'row'}>
            <p className="text-center mr-1 mb-0">
              {isMobile ? (
                <>
                  to
                  <span className="font-weight-bold">{` ${currentDomain} `}</span>
                  organization
                </>
              ) : (
                <>
                  You&apos;re currently logged into
                  <span className="font-weight-bold">{` ${currentDomain} `}</span>
                  organization
                </>
              )}
            </p>
            <Button
              variant="text"
              color="primary"
              onClick={cancelOrganizationSwitch}
              className={isMobile ? 'min-w-auto px-1' : ''}
            >
              Return
            </Button>
          </CurrentDomain>
        </Grid>
      </Grid>
    </OuterAppLayout>
  );
}

export default signInRequired(OrganizationSwitchPage);
