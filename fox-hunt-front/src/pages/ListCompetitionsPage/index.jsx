import React, { useEffect, useState, useRef } from 'react';
import { cloneDeep } from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { ViewState, Resources } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Appointments,
  Toolbar,
  AppointmentTooltip,
  MonthView,
  DayView,
  ViewSwitcher,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';
import clsx from 'clsx';
import {
  Button,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import {
  selectAllCompetitions,
  selectAllCompetitionsCount,
} from 'src/store/selectors/competitionSelectors';
import {
  currentCompetitionsLoaderSelector,
  competitionByDateLoaderSelector,
} from 'src/store/selectors/loadersSelector';
import { selectCurrentOrganization } from 'src/store/selectors/authSelectors';
import {
  cancelCompetition,
  getCompetitionByDate,
  getCompetitionById,
  getCompetitions,
  removeCompetition,
} from 'src/store/actions/competitionActions';
import { buildCreateTimeAndLocationCompetitionUrl } from 'src/api/utils/navigationUtil';
import {
  allStatuses,
  allStatusesExceptCanceled,
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_RUNNING,
  STATUS_SCHEDULED,
} from 'src/constants/competitionStatusConst';
import SelectComponent from 'src/components/SelectComponent';
import AlertDialog from 'src/components/AlertDialog';
import CancelCompetitionContainer from 'src/containers/CancelCompetitionContainer';
import ListCompetitions from 'src/containers/ListCompetitionsContainer';
import { goToCompetitionDetails } from 'src/containers/ListCompetitionsContainer/utils';
import MainLayout from 'src/layouts/MainLayout';
import { convertTimeZone } from 'src/utils/formatUtil';
import { signInRequired } from 'src/hocs/permissions';
import { NOTIFY_ERROR_GET_COMPETITION_INFO } from 'src/constants/notifyConst';
import {
  DAY,
  initialState,
  LIST,
  MONTH,
  RESOURCES,
  SCHEDULER,
} from './constants';
import { DATE_FORMATS } from 'src/constants/dateFormatConstants';
import useErrorMessage from 'src/hooks/useErrorMessage';

import './styles.scss';

dayjs.extend(localizedFormat);
console.log('ListCompetitionPage');

function ListCompetitionContainer({
  allSize,
  cancelCompetition,
  fetchCompetitionsByDate,
  fetchCompetitionsByPage,
  organization,
  removeCompetition,
}) {
  const currentDate = dayjs();
  const dispatch = useDispatch();
  const schedulerContainerRef = useRef();
  const showErrorMessage = useErrorMessage(NOTIFY_ERROR_GET_COMPETITION_INFO);

  const getFormattedDate = (date, format = 'YYYY-MM-DD') =>
    dayjs(date).format(format);

  const getFormatByView = (schedulerView) => {
    if (schedulerView === DAY) return 'YYYY-MM-DD';
    if (schedulerView === MONTH) return 'YYYY-MM';
  };

  const getDates = (competition) => {
    if (competition.status === STATUS_SCHEDULED) {
      return {
        startDate: competition.startDate,
        endDate: dayjs(competition.startDate)
          .add(1, 'minute')
          .format('DD MMM YYYY HH:mm'),
      };
    }

    if (competition.status === STATUS_RUNNING) {
      return {
        startDate: convertTimeZone(competition.actualStartDate),
        endDate: currentDate.format(DATE_FORMATS.DATE_PICKER_DISPLAY_WITH_TIME),
      };
    }

    return {
      startDate: convertTimeZone(competition.actualStartDate),
      endDate: convertTimeZone(competition.actualFinishDate),
    };
  };

  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState('');
  const [isOpenCancelModal, setCancelModalOpen] = useState(false);
  const [cancelCompetitionId, setCancelCompetitionId] = useState(null);
  const [schedulerView, setSchedulerView] = useState(MONTH);
  const [date, setDate] = useState(getFormattedDate(currentDate));
  const [view, setView] = useState(SCHEDULER);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ orderBy: 'createdDate', order: 'asc' });
  const competitionsFromState = useSelector(selectAllCompetitions);
  const competitions = cloneDeep(competitionsFromState).map((item) => ({
    ...item,
    ...getDates(item),
    title: item.name,
  }));
  const isCompetitionsLoading = useSelector(currentCompetitionsLoaderSelector);
  const isCompetitionByDateLoading = useSelector(
    competitionByDateLoaderSelector,
  );
  const isLoading = isCompetitionsLoading || isCompetitionByDateLoading;
  const isScheduleView = view === SCHEDULER;
  const isListView = view === LIST;

  useEffect(() => {
    if (isScheduleView && organization.id) {
      fetchCompetitionsByDate({
        date: getFormattedDate(date, getFormatByView(schedulerView)),
        status: status || allStatusesExceptCanceled,
      });
    }
  }, [
    date,
    status,
    fetchCompetitionsByDate,
    organization,
    isScheduleView,
    schedulerView,
  ]);

  useEffect(() => {
    if (isListView && organization.id) {
      fetchCompetitionsByPage({
        name: search,
        page: state.pager.page,
        size: state.pager.rowsPerPage,
        sort: Object.values(sort).join(','),
        statuses: status || allStatusesExceptCanceled,
        upcoming: true,
      });
    }
  }, [
    fetchCompetitionsByPage,
    isListView,
    organization,
    search,
    sort,
    state.pager.page,
    state.pager.rowsPerPage,
    status,
  ]);

  const handleChangeView = (event, view) => {
    view && setView(view);
  };

  const handleChangeSchedulerView = (view) => {
    view && setSchedulerView(view);
  };

  const handleDateChange = (date) => {
    date && setDate(getFormattedDate(date));
  };

  const handleStatusChange = (event) => setStatus(event.target.value);

  const handleCreateCompetition = () =>
    navigate(buildCreateTimeAndLocationCompetitionUrl());

  const fetchCompetitionAndRedirect = (competition) => {
    dispatch(getCompetitionById(competition.id)).then(({ payload }) => {
      if (payload?.status === 200) {
        navigate(goToCompetitionDetails(competition));
      }
      if (payload?.status === 404) showErrorMessage();
    });
  };

  const handleCancelCompetition = (competitionId) => {
    setCancelCompetitionId(competitionId);
    handleToggleModal();
  };

  const handleModalConfirm = ({ reason }) => {
    cancelCompetition({ id: cancelCompetitionId, reason });
    handleToggleModal();
  };

  const handleToggleModal = () => setCancelModalOpen(!isOpenCancelModal);

  function getCompetitionTooltipColor(status) {
    return clsx({
      '#1faa00': status === STATUS_RUNNING,
      '#9e9e9e': status === STATUS_FINISHED,
      '#0277bd': status === STATUS_SCHEDULED,
      '#c62828': status === STATUS_CANCELED,
    });
  }

  const changePager = (pager = { page: 0, rowsPerPage: 25 }) => {
    setState({ ...state, pager: { ...state.pager, ...pager } });
  };

  const searchCompetition = (event) => {
    setSearch(event.target.value);
  };

  const sortCompetition = ({ orderBy, order }) => {
    const column = orderBy === 'Date' ? 'createdDate' : orderBy;
    setSort({ orderBy: column, order });
  };

  const appointment = ({ children, style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: getCompetitionTooltipColor(restProps.data.status),
      }}
    >
      {children}
    </Appointments.Appointment>
  );

  const tooltip = ({ children, appointmentData, ...restProps }) => (
    <AppointmentTooltip.Content
      {...restProps}
      appointmentData={appointmentData}
    >
      <div
        style={{
          backgroundColor: getCompetitionTooltipColor(appointmentData.status),
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          position: 'absolute',
          top: '22px',
          left: '24px',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      >
        <Tooltip title="Edit" placement="top">
          <IconButton
            onClick={() => {
              fetchCompetitionAndRedirect(appointmentData);
            }}
            size="small"
          >
            <EditOutlined />
          </IconButton>
        </Tooltip>
        {appointmentData.status === STATUS_SCHEDULED && (
          <Tooltip title="Cancel" placement="top">
            <IconButton
              onClick={() => handleCancelCompetition(appointmentData.id)}
              size="small"
            >
              <CancelOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </span>
    </AppointmentTooltip.Content>
  );

  return (
    <MainLayout>
      <div
        ref={schedulerContainerRef}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ paddingRight: '0.5rem', paddingBottom: '0.5rem' }}>
            <Button
              color={'primary'}
              onClick={handleCreateCompetition}
              variant={'contained'}
            >
              Create a competition
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                minWidth: '150px',
                paddingBottom: '0.5rem',
                paddingRight: '0.5rem',
              }}
            >
              <SelectComponent
                items={allStatuses}
                name={'Status'}
                onChange={handleStatusChange}
                value={status}
              />
            </div>
            {isListView && (
              <div style={{ paddingRight: '0.5rem', paddingBottom: '0.5rem' }}>
                <TextField
                  label={'Competition name...'}
                  onChange={searchCompetition}
                  size={'small'}
                  value={search}
                  variant="outlined"
                />
              </div>
            )}
          </div>
        </div>
        <div style={{ paddingBottom: '0.5rem' }}>
          <ToggleButtonGroup
            exclusive
            onChange={handleChangeView}
            style={{ maxHeight: '37px' }}
            value={view}
          >
            <ToggleButton value="scheduler">
              <Tooltip title="Sheduler">
                <ViewModuleIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="List of competitions">
                <ViewListIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      {isScheduleView && (
        <Scheduler data={!isLoading && competitions.length ? competitions : []}>
          <ViewState
            defaultCurrentDate={currentDate}
            onCurrentViewNameChange={handleChangeSchedulerView}
            onCurrentDateChange={handleDateChange}
          />
          <MonthView />
          <DayView />
          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
          <Appointments appointmentComponent={appointment} />
          <AppointmentTooltip contentComponent={tooltip} />
          <Resources
            data={[
              {
                instances: RESOURCES,
              },
            ]}
          />
        </Scheduler>
      )}
      {isListView && (
        <ListCompetitions
          competitions={competitions}
          countAllRows={allSize}
          fetchCompetitionAndRedirect={fetchCompetitionAndRedirect}
          onPageChange={changePager}
          onRemoveProp={removeCompetition}
          onSortCompetition={sortCompetition}
          pager={state.pager}
          sortOrder={sort.order}
        />
      )}
      <AlertDialog
        content={
          <CancelCompetitionContainer
            submit={handleModalConfirm}
            cancel={handleToggleModal}
          />
        }
        hideControls
        onClose={handleToggleModal}
        open={isOpenCancelModal}
        text={'Please enter the cancellation reason to proceed.'}
        title={'Cancel competition'}
      />
    </MainLayout>
  );
}

const mapStateToProps = createStructuredSelector({
  allSize: selectAllCompetitionsCount,
  organization: selectCurrentOrganization,
});

export default connect(mapStateToProps, {
  cancelCompetition,
  fetchCompetitionsByDate: getCompetitionByDate,
  fetchCompetitionsByPage: getCompetitions,
  removeCompetition,
})(signInRequired(ListCompetitionContainer));
