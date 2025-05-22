import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { DebouncedInput, Loader } from 'common-front';
import { Box, Button, Grid } from '@mui/material';
import MainLayout from 'src/layouts/MainLayout';
import ListLocations from 'src/containers/ListLocationsContainer';
import { signInRequired } from 'src/hocs/permissions';
import { ConditionalContainer } from 'src/featureToggles/customFeatures/ConditionalContainer';

import { getLocations } from 'src/store/actions/locationsActions';
import { selectCurrentOrganization } from 'src/store/selectors/authSelectors';
import { locationsStateSelector } from 'src/store/selectors/locationsSelectors';
import { locationsLoaderSelector } from 'src/store/selectors/loadersSelector';

import { buildCreateLocationUrl } from 'src/api/utils/navigationUtil';
import { LOCATION_MANAGEMENT } from 'src/featureToggles/featureNameConstants';

const ListLocationContainer = () => {
  const initialState = {
    pager: {
      page: 0,
      rowsPerPage: 25,
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, setState] = useState(initialState);
  const [search, setSearch] = useState({ name: '' });

  const { locations, size } = useSelector(locationsStateSelector);
  const locationsLoading = useSelector(locationsLoaderSelector);
  const organization = useSelector(selectCurrentOrganization);

  useEffect(() => {
    dispatch(
      getLocations({
        page: state.pager.page,
        size: state.pager.rowsPerPage,
      }),
    );
  }, [state.pager.page, state.pager.rowsPerPage]);

  const changePager = (pager = { page: 0, rowsPerPage: 25 }) => {
    const newPager = Object.assign(state.pager, pager);
    const newState = { ...state, pager: newPager };
    setState(newState);
    if (!search.name) {
      dispatch(
        getLocations({
          page: state.pager.page,
          size: state.pager.rowsPerPage,
        }),
      );
    } else {
      dispatch(
        getLocations({
          name: search.name,
          page: state.pager.page,
          size: state.pager.rowsPerPage,
        }),
      );
    }
  };

  const handleLocationSearch = (name: string) => {
    dispatch(
      getLocations({
        name: name,
        page: state.pager.page,
        size: state.pager.rowsPerPage,
      }),
    );
  };

  const handleCreateLocation = () => {
    navigate(buildCreateLocationUrl());
  };

  return (
    <MainLayout>
      <Grid item container direction={'column'}>
        <Grid
          alignItems="flex-start"
          container
          direction={'row'}
          item
          spacing={1}
        >
          <ConditionalContainer feature={LOCATION_MANAGEMENT}>
            <Grid item>
              <Button
                color={'primary'}
                onClick={handleCreateLocation}
                variant={'contained'}
              >
                Create a Location
              </Button>
            </Grid>
          </ConditionalContainer>

          <Grid item>
            <DebouncedInput
              label={'Search location'}
              onChange={setSearch}
              onFinish={handleLocationSearch}
              value={search}
            />
          </Grid>
        </Grid>
      </Grid>
      <Box
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2rem',
        }}
      >
        <Loader isLoading={locationsLoading} size={100}>
          <ListLocations
            countAllRows={size}
            locations={locations}
            onPageChange={changePager}
            organization={organization}
            pager={state.pager}
          />
        </Loader>
      </Box>
    </MainLayout>
  );
};

export default signInRequired(ListLocationContainer);
