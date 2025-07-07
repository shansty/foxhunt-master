import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, Tab, Tabs } from '@mui/material';

import { useCompetition } from 'src/hooks/useCompetition';
import { reloadReplay } from 'src/store/slices/replaySlice';
import { getGameState } from 'src/store/actions/competitionActions';
import { PageTitle } from 'common-front';
import MainInformationTab from 'src/containers/ReplayCompetitionContainer/MainInformationTab';
import ReplayTab from 'src/containers/ReplayCompetitionContainer/ReplayTab';
import MainLayout from 'src/layouts/MainLayout';
import WelcomePage from '../WelcomePage';
import { signInRequired } from 'src/hocs/permissions';

const ReplayCompetitionPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const competition = useCompetition(id);

  const [tabValue, setTabValue] = useState(0);
  const [isMainInfoOpen, setIsMainInfoOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setIsMainInfoOpen(false);
    dispatch(reloadReplay());
  };

  const toggleMainInfo = () => setIsMainInfoOpen((prevState) => !prevState);

  useEffect(() => {
    dispatch(getGameState({ id, params: { replay: true } }));
  }, [id, dispatch]);

  if (!competition) {
    return <WelcomePage />;
  }

  const { name } = competition;
  const title = `Archived competition: ${name}`;
  const description = `Created by ${competition.createdBy.firstName} ${competition.createdBy.lastName}`;

  const renderTab = (component, value, index) =>
    value === index ? component : null;

  return (
    <MainLayout>
      <PageTitle titleHeading={title} titleDescription={description} />
      <Card variant={'outlined'}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Main Information" />
          <Tab label="Replay" />
        </Tabs>
        <CardContent>
          {renderTab(
            <MainInformationTab
              competition={competition}
              toggleMainInfo={toggleMainInfo}
              isMainInfoOpen={isMainInfoOpen}
              tabValue={tabValue}
            />,
            tabValue,
            0,
          )}
          {renderTab(
            <ReplayTab competition={competition} tabValue={tabValue} />,
            tabValue,
            1,
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default signInRequired(ReplayCompetitionPage);
