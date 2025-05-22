import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectAllOrganizations,
  selectAllOrganizationTrainers,
} from '../../store/selectors/orgnizationSelectors';
import * as userActions from '../../store/actions/userActions';
import { Organization } from '../../types/Organization';
import {
  RootUser,
  GetUsersParams,
  UpdateOrganizationAdminBody,
} from '../../types/RootUser';
import { OrganizationDispatch } from '../../types/Dispatch';
import { ItemsList, IListItem } from 'common-front';

interface ChangeRootUserPopupProps {
  organization: Organization;
  onClose: () => void;
  fetchUsers: (params: GetUsersParams) => Promise<any>;
  updateOrganizationAdmin: (body: UpdateOrganizationAdminBody) => void;
}

function ChangeRootUserPopup(props: ChangeRootUserPopupProps) {
  const { onClose, organization } = props;
  const [orgAdmin, setOrgAdmin] = useState<RootUser>();

  useEffect(() => {
    props
      .fetchUsers({
        roles: ['ORGANIZATION_ADMIN'],
        organizationId: organization.id,
      })
      .then(({ data }: { data: RootUser[] }) => {
        setOrgAdmin(data[0]);
      });
  }, [organization]);

  const createItem = (user: RootUser): IListItem => {
    return {
      id: user.id,
      text: `${user.firstName} ${user.lastName}`,
    };
  };

  const loadTrainers = async (params: {
    page: number;
    rowsPerPage: number;
  }): Promise<IListItem[]> => {
    const result = await props.fetchUsers({
      roles: ['TRAINER'],
      page: params.page,
      size: params.rowsPerPage,
      organizationId: organization.id,
      active: true,
    });
    return result.data.map((user: RootUser): IListItem => createItem(user));
  };

  const onSubmit = (id: number | undefined) => {
    if (id && orgAdmin && id !== orgAdmin.id) {
      props.updateOrganizationAdmin({
        organizationId: organization.id,
        userId: id,
      });
    }
    onClose();
  };

  return (
    <ItemsList
      title="Change admin"
      defaultSelectedItem={orgAdmin ? createItem(orgAdmin) : undefined}
      withAvatar={true}
      onLoadMore={loadTrainers}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}

const mapStateToProps = createStructuredSelector({
  organizations: selectAllOrganizations,
  trainers: selectAllOrganizationTrainers,
});

const mapDispatchToProps = (dispatch: OrganizationDispatch) => ({
  fetchUsers: (params: GetUsersParams) =>
    dispatch(userActions.fetchUsers(params)),
  updateOrganizationAdmin: (body: UpdateOrganizationAdminBody) =>
    dispatch(userActions.updateOrganizationAdmin(body)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeRootUserPopup);
