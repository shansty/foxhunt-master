import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ERRORS } from '../../../../constants/commonConst';
import { TableCell, TableRow } from '@mui/material';
import { useIsMobile } from 'common-front';
import {
  createTooltip,
  updateTooltip,
} from '../../../../store/actions/tooltipsActions';
import { TooltipShape } from '../propShapes';
import { tooltipsCodes } from '../../../../constants/tooltipsCodes';
import TooltipMobileFormInputs from '../TooltipMobileFormInputs/TooltipMobileFormInputs';
import TooltipFormInputs from '../TooltipFormInputs/TooltipFormInputs';
import { selectNotCreatedTooltips } from '../../../../store/selectors/tooltipsSelectors';
import { ActionCell } from '../styles';
import { ActionButton, Index } from './styles';
import useClickAway from '../../../../hooks/useClickAway';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const SelectProps = {
  MenuProps: {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  },
};

const validationSchema = Yup.object().shape({
  code: Yup.string().required(ERRORS.REQUIRED_FIELD).max(50),
  message: Yup.string().required(ERRORS.REQUIRED_FIELD),
});

const addCondition = (event) => {
  const menu = document.getElementById('menu-code');
  const code = document.getElementById('tooltipCode');
  const message = document.getElementById('messageCode');
  return (
    !menu?.contains(event.target) &&
    code?.innerText?.length <= 1 &&
    !message?.innerHTML
  );
};

function getAllCodes() {
  return tooltipsCodes.map(({ value }) => ({
    label: value,
    value,
  }));
}

function CreateTooltipForm({ deleteLine, tooltip, index }) {
  const notCreatedTooltips = useSelector(selectNotCreatedTooltips);
  const initialValues = { ...tooltip };
  if (!tooltip) {
    initialValues.code = '';
  }
  const tooltipId = tooltip.id;
  const selectItems = tooltip ? getAllCodes() : notCreatedTooltips;
  const isMobile = useIsMobile();

  const dispatch = useDispatch();

  const formRef = useRef(null);
  useClickAway(formRef, deleteLine, addCondition);

  const onSave = useCallback(
    (values, { setSubmitting }) => {
      const { code, message } = values;

      setSubmitting(false);

      if (tooltipId) {
        const updatedTooltip = {
          id: tooltipId,
          code,
          message,
        };
        dispatch(updateTooltip(updatedTooltip));
      } else {
        const createdTooltip = {
          code,
          message,
        };
        dispatch(createTooltip(createdTooltip));
      }

      deleteLine();
    },
    [deleteLine, dispatch, tooltipId],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSave}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleSubmit }) => (
        <TableRow ref={formRef}>
          <TableCell scope="row" align="left" sx={{ width: '5%' }}>
            <Index>{index}</Index>
          </TableCell>
          {isMobile ? (
            <TooltipMobileFormInputs
              handleChange={handleChange}
              SelectProps={SelectProps}
              tooltip={tooltip}
              selectItems={selectItems}
            />
          ) : (
            <TooltipFormInputs
              handleChange={handleChange}
              SelectProps={SelectProps}
              tooltip={tooltip}
              selectItems={selectItems}
            />
          )}
          <ActionCell align="left">
            <ActionButton type="submit" color="primary" onClick={handleSubmit}>
              Save
            </ActionButton>
            <ActionButton color="primary" onClick={deleteLine}>
              Cancel
            </ActionButton>
          </ActionCell>
        </TableRow>
      )}
    </Formik>
  );
}

CreateTooltipForm.propTypes = {
  tooltip: TooltipShape.isRequired,
  deleteLine: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default CreateTooltipForm;
