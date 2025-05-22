import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ListItem } from '@mui/material';
import AlertDialog from '../AlertDialog';
import CompetitionTemplateContainer from 'src/pages/CompetitionTemplatePage'; // TODO Really ???
import {
  createCompetitionFromTemplate,
  getCompetitionById,
} from '../../store/actions/competitionActions';
import { buildLaunchCompetitionByIdUrl } from '../../api/utils/navigationUtil';
import { selectCompetitionTemplates } from '../../store/selectors/competitionSelectors';
import {
  GENERATE_TEMPLATE_COMPETITION_TEXT,
  GENERATE_TEMPLATE_COMPETITION_TITLE,
} from '../../constants/alertConst';
import { getSideBarMenuPadding } from '../../utils/stylesUtil';

function SidebarMenuButton(props) {
  const { title, depth, icon: Icon, className, label: Label, ...rest } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allTemplates = useSelector(selectCompetitionTemplates);
  const currentTemplate = allTemplates.find(
    (template) => template.name === title,
  );
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const style = React.useMemo(() => getSideBarMenuPadding(depth), [depth]);

  const handlePopupConfirm = async (name) => {
    const { payload: newCompetition } = await dispatch(
      createCompetitionFromTemplate({ name, id: currentTemplate?.id }),
    );

    if (newCompetition instanceof Error) {
      return;
    }

    const { id } = newCompetition;
    setIsPopupOpen(false);
    await dispatch(getCompetitionById(id));
    navigate(buildLaunchCompetitionByIdUrl(id));
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <ListItem
      {...rest}
      className={clsx('app-sidebar-item app-sidebar-button', className)}
      disableGutters
    >
      <Button
        disableRipple
        color="primary"
        variant="text"
        style={style}
        className={clsx('app-sidebar-button-wrapper')}
        onClick={() => setIsPopupOpen(true)}
      >
        {Icon && <Icon className="app-sidebar-icon" />}
        {title}
        {Label && (
          <span className="menu-item-label">
            <Label />
          </span>
        )}
      </Button>
      <AlertDialog
        hideControls
        open={isPopupOpen}
        title={GENERATE_TEMPLATE_COMPETITION_TITLE}
        text={GENERATE_TEMPLATE_COMPETITION_TEXT}
        onClose={handlePopupClose}
        content={
          <CompetitionTemplateContainer
            submit={handlePopupConfirm}
            cancel={handlePopupClose}
          />
        }
      />
    </ListItem>
  );
}

SidebarMenuButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default SidebarMenuButton;
