import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import AlertDialog from '../../components/AlertDialog';
import { DropdownMenu, TableHeader, useIsMobile } from 'common-front';
import TableFooterComponent from '../../components/TableFooter';
import {
  DELETE_LOCATION_PACKAGE_TEXT,
  DELETE_LOCATION_PACKAGE_TITLE,
} from '../../constants/alertConst';
import { buildUpdateLocationPackageByIdUrl } from '../../api/utils/navigationUtil';
import { ListAlt, Public } from '@mui/icons-material';
import {
  locationPackageCreationTypeEnum,
  locationPackageTypeEnum,
} from '../../utils/enums';
import { useNavigate } from 'react-router-dom';
import { getLocationPackageById } from 'src/store/actions/locationPackagesActions';

const packageCreationTypeTooltip = {
  LIST_BASED: 'List-based package',
  AREA_BASED: 'Area-based package',
};

const userFriendlyPackageTypes = new Map([
  [locationPackageTypeEnum.SYSTEM, 'System'],
  [locationPackageTypeEnum.PRIVATE, 'Private'],
  [locationPackageTypeEnum.SHARED, 'Extension'],
]);

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip arrow {...props} classes={{ popper: className }}>
    {props.children}
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    '&:before': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    color: theme.palette.primary.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
}));

function ListLocationPackages(props) {
  const isMobile = useIsMobile();
  const {
    locationPackages,
    onRemoveLocationPackage,
    pager,
    onPageChange,
    countAllRows,
  } = props;

  const [open, setOpen] = useState(false);
  const [locationPackageToRemove, setLocationPackageToRemove] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function remove(locationPackage) {
    onRemoveLocationPackage(locationPackage);
    closeAlertDialog();
  }

  function showAlertDialog(locationPackage) {
    setLocationPackageToRemove(locationPackage);
    setOpen(true);
  }

  function closeAlertDialog() {
    setOpen(false);
    setLocationPackageToRemove(null);
  }

  const getActionItems = (locationPackage) => {
    const fetchLocationPackageAndRedirect = (id) => {
      dispatch(getLocationPackageById(id)).then(({ payload }) => {
        if (payload?.status === 200) {
          navigate(buildUpdateLocationPackageByIdUrl(id));
        }
      });
    };

    const { locationPackageId: id } = locationPackage;

    const items = [
      {
        id,
        title: locationPackage.updatable ? 'Edit' : 'Details',
        action: () => fetchLocationPackageAndRedirect(id),
      },
    ];
    if (locationPackage.updatable) {
      items.push({
        id,
        title: 'Remove',
        action: () => showAlertDialog(locationPackage),
      });
    }
    return items;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="collapsible table">
          <TableHeader
            headerCells={[
              { name: '#' },
              { name: 'Name' },
              { name: 'Type' },
              { name: 'Created by' },
              { name: 'Description', hideOnMobile: true },
              { name: 'Operation' },
            ]}
          />
          <TableBody>
            {locationPackages.map((locationPackage, index) => (
              <TableRow key={locationPackage.locationPackageId}>
                <TableCell scope="row" align={'justify'}>
                  {pager.page * pager.rowsPerPage + ++index}
                </TableCell>
                <TableCell align={'justify'}>
                  {`${locationPackage.name}  `}
                  <StyledTooltip
                    placement="right"
                    title={
                      packageCreationTypeTooltip[locationPackage.assignmentType]
                    }
                  >
                    {locationPackage.assignmentType ===
                    locationPackageCreationTypeEnum.LIST_BASED ? (
                      <ListAlt />
                    ) : (
                      <Public />
                    )}
                  </StyledTooltip>
                </TableCell>
                <TableCell align={'justify'}>
                  {`${userFriendlyPackageTypes.get(
                    locationPackage.accessType,
                  )}`}
                </TableCell>
                <TableCell align={'justify'}>
                  {`${locationPackage.createdBy.firstName} ${locationPackage.createdBy.lastName}`}
                </TableCell>
                {!isMobile && (
                  <TableCell align={'justify'}>
                    {locationPackage.description
                      ? locationPackage.description
                      : '-'}
                  </TableCell>
                )}
                <TableCell align={'justify'}>
                  <DropdownMenu items={getActionItems(locationPackage)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooterComponent
            pager={pager}
            onChange={onPageChange}
            countAllRows={countAllRows}
          />
        </Table>
        <AlertDialog
          open={open}
          onClose={closeAlertDialog}
          title={DELETE_LOCATION_PACKAGE_TITLE}
          text={DELETE_LOCATION_PACKAGE_TEXT}
          onSubmit={() => remove(locationPackageToRemove)}
        />
      </TableContainer>
    </>
  );
}

export default ListLocationPackages;
