import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Card from '@mui/material/Card';
import {
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import './styles.scss';
import { DropdownMenu, TableHeader } from 'common-front';
import { connect } from 'react-redux';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Button from '@mui/material/Button';
import { PageTitle } from 'common-front';
import {
  selectAllCompetitionInvitations,
  selectCompetition,
  selectCompetitionLoadingState,
} from 'src/store/selectors/competitionSelectors';
import * as compActions from 'src/store/actions/competitionActions';
import {
  INVITATION_SOURCE,
  INVITATION_STATUS,
} from 'src/store/constants/commonConstants';
import { getParticipants } from 'src/store/actions/participantActions';
import { selectAllParticipants } from 'src/store/selectors/participantSelectors';
import {
  getAllCompetitionSteps,
  getCompletedStep,
} from 'src/utils/stepperUtils';
import {
  buildLaunchCompetitionByIdUrl,
  buildSettingsCompetitionByIdUrl,
} from 'src/api/utils/navigationUtil';
import {
  STATUS_SCHEDULED,
  STATUS_CANCELED,
} from 'src/constants/competitionStatusConst';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import AlertDialog from 'src/components/AlertDialog';
import CancelCompetitionContainer from 'src/containers/CancelCompetitionContainer';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';
import { dropdownItem } from './utils';

function ListCompetitionInvitationsPage(props) {
  const {
    invitations,
    participants,
    loggedUser,
    fetchCompetition,
    fetchInvitations,
    fetchParticipants,
    cancelCompetition,
    accept,
    invite,
    decline,
    permanentlyDecline,
  } = props;

  const { id } = useParams();

  const [pageLoading, setPageLoading] = useState(true);
  const [isOpenCancelModal, setCancelModalOpen] = useState(false);
  const navigate = useNavigate();
  const competition = useSelector((state) => selectCompetition(state, { id }));

  const title = `Competition: ${competition?.name}`;
  const description = `Created by ${competition?.createdBy.firstName} ${competition?.createdBy.lastName}`;
  const isCanceled =
    competition?.status === STATUS_CANCELED &&
    `The competition was cancelled. Reason: ${competition.cancellationReason}`;
  const activeStep = 2;
  const steps = getAllCompetitionSteps();
  const completedStep = getCompletedStep(competition);

  const permanentlyDeclinedAmount = invitations.filter(
    (invitation) => invitation.status === 'PERMANENTLY_DECLINED',
  ).length;
  const typographyClasses = clsx({
    'app-sidebar-heading': true,
    'text-center': true,
  });
  const typographyId = clsx({
    'additional-padding': !!permanentlyDeclinedAmount,
  });

  useEffect(() => {
    Promise.all([
      fetchCompetition(id),
      fetchInvitations(id),
      fetchParticipants(),
    ]).then(() => {
      setPageLoading(false);
    });
  }, [fetchCompetition, fetchInvitations, fetchParticipants, id]);

  let disabled = true;
  if (id && competition?.coach.id) {
    if (
      loggedUser &&
      loggedUser.id === competition.coach.id &&
      competition.status === STATUS_SCHEDULED
    ) {
      disabled = false;
    }
  }

  const hasInvitationWithStatus = (participant, status) =>
    !!invitations.filter(
      (invitation) =>
        invitation.participant.id === participant.id &&
        invitation.status === status,
    )[0];

  const hasInvitation = (participant) => {
    const foundParticipantInvitation = invitations.find(
      (invitation) => invitation.participant.id === participant.id,
    );
    return !!foundParticipantInvitation;
  };

  const countByStatus = (status) =>
    invitations.filter((invitation) => invitation.status === status).length;

  const getInvitationsByStatus = (status) =>
    invitations.filter((invitation) => invitation.status === status);

  const declinedParticipants = participants
    .filter((participant) =>
      hasInvitationWithStatus(participant, INVITATION_STATUS.DECLINED),
    )
    .map((participant) => ({
      ...participant,
      status: INVITATION_STATUS.DECLINED,
    }));
  const availableParticipants = participants.filter(
    (participant) => !hasInvitation(participant),
  );

  const getFreeParticipantsOrWithDeclinedInvitation = () => {
    return declinedParticipants.concat(availableParticipants);
  };

  const countFreeOrDeclinedInvitations = () =>
    getFreeParticipantsOrWithDeclinedInvitation().length;

  const excludeParticipant = (invitation) => {
    props
      .exclude(invitations, competition?.id, invitation.participant.id)
      .then(() => {
        props.fetchCompetition(id);
      });
  };

  const isNextBtnDisabled = () => {
    let isDisabled = true;
    if (!disabled && competition?.participants.length > 0) {
      isDisabled = false;
    }
    return isDisabled;
  };

  const goToSettings = () => {
    navigate(buildSettingsCompetitionByIdUrl(id));
  };

  const goToLaunch = () => {
    navigate(buildLaunchCompetitionByIdUrl(id));
  };

  if (!props.isLoading && !competition?.foxAmount && !pageLoading) {
    goToSettings();
  }

  const handleCancelCompetition = () => {
    handleToggleModal();
  };

  const handleModalConfirm = ({ reason }) => {
    cancelCompetition(competition.id, reason);
    handleToggleModal();
  };

  const handleToggleModal = () => setCancelModalOpen(!isOpenCancelModal);

  const acceptParticipant = (invitation) => {
    accept(invitations, competition?.id, invitation.participant.id).then(() => {
      fetchCompetition(id);
    });
  };

  const declineParticipant = (invitation) => {
    decline(invitations, competition?.id, invitation.participant.id);
  };

  const permanentlyDeclineParticipant = (participant) => {
    permanentlyDecline(invitations, competition.id, participant.id);
  };

  const inviteParticipant = (participant) => {
    invite(invitations, competition.id, participant.id);
  };

  const getInviteDropdownItems = (participant) => {
    return dropdownItem.getInviteDeclineItems(
      () => inviteParticipant(participant),
      () => permanentlyDeclineParticipant(participant),
    );
  };

  const getTableRow = (invitation) => {
    const { participant } = invitation;
    const { firstName, lastName } = participant;
    const isTrainerInvited = invitation.source === INVITATION_SOURCE.TRAINER;
    const isParticipantApplied =
      invitation.source === INVITATION_SOURCE.PARTICIPANT;

    const dropdownItems = isParticipantApplied
      ? dropdownItem.getAcceptDeclineItems(
          () => acceptParticipant(invitation),
          () => declineParticipant(invitation),
          () => permanentlyDeclineParticipant(participant),
        )
      : dropdownItem.getDeclineItems(
          () => declineParticipant(invitation),
          () => permanentlyDeclineParticipant(participant),
        );

    return (
      <TableRow key={invitation.id}>
        <TableCell>{`${firstName} ${lastName}`}</TableCell>
        <TableCell>
          {isTrainerInvited && (
            <span className={'badge m-1 badge-warning'}>Invitation sent</span>
          )}
          {isParticipantApplied && (
            <span className={'badge m-1 badge-warning'}>
              Waiting for approval
            </span>
          )}
        </TableCell>
        <TableCell>
          {!disabled && <DropdownMenu items={dropdownItems} />}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <MainLayout>
      {!pageLoading && (
        <>
          <PageTitle
            titleHeading={title}
            titleDescription={description}
            titleStatus={isCanceled}
          />
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
            {steps.map((label, stepNumber) => (
              <Step
                key={label}
                completed={
                  stepNumber <= completedStep && stepNumber !== activeStep
                }
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Card variant="standard">
            <CardContent>
              <Grid container direction={'column'}>
                <Grid item container spacing={2} direction={'row'}>
                  <Grid item className={'item'}>
                    <Typography id={typographyId} className={typographyClasses}>
                      Participation confirmed -{' '}
                      {countByStatus(INVITATION_STATUS.ACCEPTED)}
                    </Typography>
                    <TableContainer
                      component={Paper}
                      className={'scrollable-table'}
                    >
                      <Table stickyHeader={true}>
                        <TableHeader
                          headerCells={[
                            { name: 'Username' },
                            { name: 'Updated' },
                            { name: 'Actions' },
                          ]}
                        />
                        <TableBody>
                          {getInvitationsByStatus(
                            INVITATION_STATUS.ACCEPTED,
                          ).map((invitation) => (
                            <TableRow key={invitation.id}>
                              <TableCell>
                                {invitation.participant.firstName}{' '}
                                {invitation.participant.lastName}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  invitation.updatedAt,
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {!disabled && (
                                  <DropdownMenu
                                    items={[
                                      {
                                        id: invitation.id,
                                        title: 'Exclude',
                                        to: '#',
                                        action: () =>
                                          excludeParticipant(invitation),
                                      },
                                    ]}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item className={'item'}>
                    <Typography id={typographyId} className={typographyClasses}>
                      Pending invitations -{' '}
                      {countByStatus(INVITATION_STATUS.PENDING)}
                    </Typography>
                    <TableContainer
                      component={Paper}
                      className={'scrollable-table'}
                    >
                      <Table stickyHeader={true}>
                        <TableHeader
                          headerCells={[
                            { name: 'Username' },
                            { name: 'Status' },
                            { name: 'Actions' },
                          ]}
                        />
                        <TableBody>
                          {getInvitationsByStatus(
                            INVITATION_STATUS.PENDING,
                          ).map((invitation) => getTableRow(invitation))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item className={'item'}>
                    <Typography className={'app-sidebar-heading text-center'}>
                      Available participants -{' '}
                      {countFreeOrDeclinedInvitations()}
                    </Typography>
                    {!!permanentlyDeclinedAmount && (
                      <Typography
                        id="additional-title"
                        className={'app-sidebar-heading text-center'}
                      >
                        Permanently declined participants -{' '}
                        {permanentlyDeclinedAmount}
                      </Typography>
                    )}
                    <TableContainer
                      component={Paper}
                      className={'scrollable-table'}
                    >
                      <Table stickyHeader={true}>
                        <TableHeader
                          headerCells={[
                            { name: 'Username' },
                            { name: 'Invite status' },
                            { name: 'Actions' },
                          ]}
                        />
                        <TableBody>
                          {getFreeParticipantsOrWithDeclinedInvitation().map(
                            (participant) => (
                              <TableRow key={participant.id}>
                                <TableCell>
                                  {participant.firstName} {participant.lastName}
                                </TableCell>
                                <TableCell>
                                  {participant.status ? (
                                    <span className={'badge m-1 badge-danger'}>
                                      {participant.status}
                                    </span>
                                  ) : null}
                                </TableCell>
                                <TableCell>
                                  {!disabled && (
                                    <DropdownMenu
                                      items={getInviteDropdownItems(
                                        participant,
                                      )}
                                    />
                                  )}
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid
                    item
                    container
                    direction={'row'}
                    mt={2}
                    justifyContent={'space-between'}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={goToSettings}
                      >
                        Back
                      </Button>
                      {competition?.status === STATUS_SCHEDULED && (
                        <Button
                          style={{ marginLeft: '1rem' }}
                          onClick={handleCancelCompetition}
                          variant="contained"
                          color="error"
                          type={'submit'}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                    <Button
                      disabled={isNextBtnDisabled()}
                      onClick={goToLaunch}
                      variant="contained"
                      color="primary"
                      type={'submit'}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <AlertDialog
            hideControls
            open={isOpenCancelModal}
            title={'Cancel competition'}
            text={'Please enter the cancellation reason to proceed.'}
            onClose={handleToggleModal}
            content={
              <CancelCompetitionContainer
                submit={handleModalConfirm}
                cancel={handleToggleModal}
              />
            }
          />
        </>
      )}
    </MainLayout>
  );
}

ListCompetitionInvitationsPage.propTypes = {
  competition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    notes: PropTypes.string,
    startDate: PropTypes.string,
    participants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    ),
  }),
  invitations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      updatedAt: PropTypes.string,
      participant: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  ).isRequired,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  ).isRequired,
  invite: PropTypes.func.isRequired,
  exclude: PropTypes.func.isRequired,
  decline: PropTypes.func.isRequired,
  permanentlyDecline: PropTypes.func.isRequired,
  accept: PropTypes.func.isRequired,
  fetchCompetition: PropTypes.func.isRequired,
  fetchParticipants: PropTypes.func.isRequired,
  fetchInvitations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  participants: selectAllParticipants(state),
  invitations: selectAllCompetitionInvitations(state),
  isLoading: selectCompetitionLoadingState(state),
  loggedUser: selectLoggedUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchCompetition: (id) => dispatch(compActions.getCompetitionById(id)),
  fetchParticipants: () => dispatch(getParticipants()),
  fetchInvitations: (id) =>
    dispatch(compActions.getAllInvitationsByCompetitionId(id)),
  cancelCompetition: (id, reason) =>
    dispatch(compActions.cancelCompetition({ id, reason })),
  invite: (invitations, competitionId, userId) =>
    dispatch(
      compActions.inviteToCompetitionByUserId({
        invitations,
        competitionId,
        participantId: userId,
      }),
    ),
  exclude: (invitations, competitionId, userId) =>
    dispatch(
      compActions.excludeFromCompetitionByUserId({
        invitations,
        competitionId,
        participantId: userId,
      }),
    ),
  decline: (invitations, competitionId, userId) =>
    dispatch(
      compActions.declineInvitationToCompetitionByUserId({
        invitations,
        competitionId,
        participantId: userId,
      }),
    ),
  permanentlyDecline: (invitations, competitionId, participantId) =>
    dispatch(
      compActions.declineInvitationPermanently({
        invitations,
        competitionId,
        participantId,
      }),
    ),
  accept: (invitations, competitionId, userId) =>
    dispatch(
      compActions.acceptInvitationToCompetitionByUserId({
        invitations,
        competitionId,
        participantId: userId,
      }),
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(signInRequired(ListCompetitionInvitationsPage));
