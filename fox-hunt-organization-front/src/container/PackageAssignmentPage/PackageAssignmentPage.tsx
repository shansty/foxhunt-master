import { isEmpty, isUndefined } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CustomTable from '../../component/CustomTable/CustomTable';
import { HeaderColumn, Row } from '../../types/CustomTable';
import {
  OrganizationPackage,
  Package,
  UpdateOrganizationPackage,
} from '../../types/Packages';
import * as packageActions from '../../store/actions/packageActions';
import { createStructuredSelector } from 'reselect';
import { PackageDispatch } from '../../types/Dispatch';
import {
  selectAllPackages,
  selectAllOrganizationPackages,
} from '../../store/selectors/packageSelectors';

const FIRST_COLUMN: HeaderColumn[] = [
  {
    id: 'packagesOrganizations',
    label: 'Packages Organizations',
    sticky: true,
  },
];
interface PackageAssignmentPageProps {
  organizationPackages?: OrganizationPackage[];
  packages?: Package[];
  fetchPackagesOrganization: () => void;
  updateOrganizationPackage: (data: UpdateOrganizationPackage) => any;
  fetchPackages: () => void;
}

function PackageAssignmentPage({
  organizationPackages = [],
  packages = [],
  ...props
}: any) {
  const title = 'Package Assignment';
  const description = 'Table shows all organizations with shared packages.';
  const {
    fetchPackagesOrganization,
    fetchPackages,
    updatePackagesOrganization,
  } = props;
  console.info(props);
  const [rows, setRows] = useState<Row[]>([]);
  const [headers, setHeaders] = useState<HeaderColumn[]>([]);

  const getHeaders = (): HeaderColumn[] => {
    return FIRST_COLUMN.concat(
      packages.map((el: any) => {
        return {
          id: el.id,
          label: el.name,
        };
      }),
    );
  };

  const getRows = (): Row[] => {
    return organizationPackages.map((el: OrganizationPackage) => {
      return {
        id: el.id,
        name: el.name,
        items: packages.map((orgPackage: Package) => {
          const enableValue: any = el.packages.get(
            orgPackage.locationPackageId,
          );

          return {
            id: orgPackage.locationPackageId,
            value: !isUndefined(enableValue) ? enableValue : false,
          };
        }),
      };
    });
  };

  useEffect(() => {
    fetchPackagesOrganization();
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!isEmpty(packages)) {
      setHeaders(getHeaders());
    }
    if (!isEmpty(organizationPackages) && !isEmpty(packages)) {
      setRows(getRows());
    }
  }, [organizationPackages, packages]);

  const onPackageCheckboxChange = (data: any) => {
    const preparedValues: UpdateOrganizationPackage = {
      assignments: [],
      unassignments: [],
    };

    for (const cell of data.values()) {
      preparedValues[`${cell.value ? 'assignments' : 'unassignments'}`].push({
        organizationId: cell.organizationId,
        locationPackageId: cell.itemId,
      });
    }

    updatePackagesOrganization(preparedValues);
  };

  return (
    <CustomTable
      rows={rows}
      headers={headers}
      tableTitle={title}
      tableDescr={description}
      handleChange={onPackageCheckboxChange}
    />
  );
}

const mapDispatchToProps = (dispatch: PackageDispatch) => ({
  fetchPackages: () => dispatch(packageActions.fetchPackages()),
  fetchPackagesOrganization: () =>
    dispatch(packageActions.fetchOrganizationPackages()),
  updatePackagesOrganization: (data: UpdateOrganizationPackage) =>
    dispatch(packageActions.updateOrganizationPackage(data)),
});

const mapStateToProps = createStructuredSelector({
  organizationPackages: selectAllOrganizationPackages,
  packages: selectAllPackages,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PackageAssignmentPage);
