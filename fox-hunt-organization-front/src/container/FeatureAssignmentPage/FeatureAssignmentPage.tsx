import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CustomTable from '../../component/CustomTable/CustomTable';
import * as featureOrganizationActions from '../../store/actions/featureOrganizationActions';
import * as featureActions from '../../store/actions/featureActions';
import { createStructuredSelector } from 'reselect';
import { selectAllFeatureOrganization } from '../../store/selectors/featureOrganizationSelectors';
import { selectAllFeatures } from '../../store/selectors/featureSelectors';
import {
  FeatureOrganization,
  UpdateFeatureOrganization,
} from '../../types/FeatureOrganization';
import { Feature } from '../../types/Feature';
import { HeaderColumn, Row, updatedCell } from '../../types/CustomTable';
import { isEmpty, isUndefined } from 'lodash';
import { FeatureOrganizationDispatch } from '../../types/Dispatch';

const FIRST_COLUMN: HeaderColumn[] = [
  {
    id: 'featuresOrganizations',
    label: 'Features Organizations',
    sticky: true,
  },
];

interface FeatureAssignmentPageProps {
  featureOrganizations?: FeatureOrganization[];
  features?: Feature[];
  fetchFeaturesOrganization: () => void;
  updateFeaturesOrganization: (data: UpdateFeatureOrganization) => any;
  fetchFeatures: () => void;
}

function FeatureAssignmentPage({
  featureOrganizations = [],
  features = [],
  ...props
}: FeatureAssignmentPageProps) {
  const title = 'Feature Assignment';
  const description = 'Table shows all organizations with features.';
  const {
    fetchFeaturesOrganization,
    fetchFeatures,
    updateFeaturesOrganization,
  } = props;
  const [rows, setRows] = useState<Row[]>([]);
  const [headers, setHeaders] = useState<HeaderColumn[]>([]);
  const getHeaders = (): HeaderColumn[] => {
    return FIRST_COLUMN.concat(
      features.map((el: any) => {
        return {
          id: el.id,
          label: el.displayName,
        };
      }),
    );
  };

  const getRows = (): Row[] => {
    return featureOrganizations.map((el: FeatureOrganization) => {
      return {
        id: el.id,
        name: el.name,
        items: features.map((feature: Feature) => {
          const enableValue: any = el.featureOrganizations.get(feature.id);

          return {
            id: feature.id,
            value: !isUndefined(enableValue)
              ? enableValue
              : feature.isGlobalyEnabled,
          };
        }),
      };
    });
  };

  useEffect(() => {
    fetchFeaturesOrganization();
    fetchFeatures();
  }, []);

  useEffect(() => {
    if (!isEmpty(features)) {
      setHeaders(getHeaders());
    }
    if (!isEmpty(featureOrganizations) && !isEmpty(features)) {
      setRows(getRows());
    }
  }, [featureOrganizations, features]);

  const onFeatureCheckboxChange = (data: Map<string, updatedCell>) => {
    const preparedValues: UpdateFeatureOrganization = {
      featureOrganizationEntities: [],
    };

    for (const cell of data.values()) {
      preparedValues.featureOrganizationEntities.push({
        organizationEntity: cell.organizationId,
        isEnabled: cell.value,
        featureEntity: cell.itemId,
      });
    }
    updateFeaturesOrganization(preparedValues).then(() => {
      fetchFeaturesOrganization();
    });
  };

  return (
    <CustomTable
      rows={rows}
      headers={headers}
      tableTitle={title}
      tableDescr={description}
      handleChange={onFeatureCheckboxChange}
    />
  );
}

const mapDispatchToProps = (dispatch: FeatureOrganizationDispatch) => ({
  fetchFeatures: () => dispatch(featureActions.fetchFeatures()),
  fetchFeaturesOrganization: () =>
    dispatch(featureOrganizationActions.fetchFeaturesOrganization()),
  updateFeaturesOrganization: (data: UpdateFeatureOrganization) =>
    dispatch(featureOrganizationActions.updateFeaturesOrganization(data)),
});

const mapStateToProps = createStructuredSelector({
  featureOrganizations: selectAllFeatureOrganization,
  features: selectAllFeatures,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeatureAssignmentPage);
