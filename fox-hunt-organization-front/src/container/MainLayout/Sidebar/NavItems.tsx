import {
  buildAllOrganizationsFeedbacksUrl,
  buildFeaturesUrl,
  buildNewOrganizationUrl,
  buildNewUserUrl,
  buildOrganizationUrl,
  buildRatePlansUrl,
  buildUserInvitationUrl,
  buildUsersUrl,
  buildFeatureAssignmentUrl,
  buildFeatureManagmentUrl,
  buildPackageAssignmentUrl,
} from '../../../utils/RoutingUtil';
import _ from 'lodash';

const createGeneralNavItem = (label: any, content: any) => ({
  label: label,
  content: content,
});

const createNavElement = (elements: any, urlBuilder: any) => {
  if (elements) {
    const navElement: any = [];
    elements.forEach((element: any) => {
      const locationArray = [element.name, urlBuilder(element.id)];
      navElement.push(locationArray);
    });
    return navElement;
  }
};

const organization = [
  'Organization',
  ['Create Organization', buildNewOrganizationUrl()],
  ['All Organizations', buildOrganizationUrl()],
];

const invitations = ['Invitations', buildUserInvitationUrl()];

const users = [
  'Users',
  ['Create', buildNewUserUrl()],
  ['All Users', buildUsersUrl()],
];

const features = [
  'Features',
  ['Feature Management', buildFeatureManagmentUrl()],
  ['Feature Assignment', buildFeatureAssignmentUrl()],
];

const ratePlans = ['Rate Plans', buildRatePlansUrl()];

const packages = ['Package Assignment', buildPackageAssignmentUrl()];

const userFeedback = ['Feedbacks', buildAllOrganizationsFeedbacksUrl()];

const createNavItem = (itemArray: any) => {
  const item: any = {};
  item.label = itemArray[0];
  item.content = [];
  for (let i = 1; i < itemArray.length; i++) {
    if (_.isArray(itemArray[i])) {
      item.content.push(createNavItem(itemArray[i]));
    } else {
      item.to = itemArray[i];
      item.content = undefined;
    }
  }
  return item;
};

const createNavBar = () => {
  const organizationItem = createNavItem(organization);
  const invitationsItem = createNavItem(invitations);
  const usersItem = createNavItem(users);
  const featuresItem = createNavItem(features);
  const ratePlansItem = createNavItem(ratePlans);
  const packageItem = createNavItem(packages);
  const userFeedbacksItem = createNavItem(userFeedback);
  return [
    createGeneralNavItem('Navigation menu', [
      organizationItem,
      invitationsItem,
      usersItem,
      featuresItem,
      packageItem,
      ratePlansItem,
      userFeedbacksItem,
    ]),
  ];
};

export default createNavBar;
