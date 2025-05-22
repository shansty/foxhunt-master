import _ from 'lodash';
import {
  buildCompetitionUrl,
  buildCreateLocationPackageUrl,
  buildCreateLocationUrl,
  buildCreateTimeAndLocationCompetitionUrl,
  buildHelpContentUrl,
  buildLocationPackageUrl,
  buildLocationUrl,
  buildUpdateLocationByIdUrl,
  buildUserUrl,
  buildWatchOneCompetitionByIdUrl,
  buildTooltipsUrl,
} from '../../api/utils/navigationUtil';
import { isFeatureEnabled } from '../../featureToggles/FeatureTogglesUtils';
import { LOCATION_MANAGEMENT } from '../../featureToggles/featureNameConstants';
import { LOCATION_PACKAGE_MANAGEMENT } from '../../featureToggles/featureNameConstants';
import { HELP_CONTENT_MANAGEMENT } from '../../featureToggles/featureNameConstants';
import { TOOLTIP_MANAGEMENT } from '../../featureToggles/featureNameConstants';
import { COMPETITION_TEMPLATE_MANAGEMENT } from '../../featureToggles/featureNameConstants';

function createGeneralNavItem(label, content) {
  return {
    label: label,
    content: content,
  };
}

function createNavElement(elements, urlBuilder) {
  if (elements) {
    const navElement = [];
    elements.forEach((element) => {
      const locationArray = [element.name, urlBuilder(element.id)];
      navElement.push(locationArray);
    });
    return navElement;
  }
}

function buildLocation() {
  const items = [];
  items.push('Locations');
  isFeatureEnabled(LOCATION_MANAGEMENT) &&
    items.push(['Create Location', buildCreateLocationUrl()]);
  items.push(['All Locations', buildLocationUrl()]);
  return items;
}

function createHelpManagementNavLinks(
  isHelpContentFeatureOn,
  isTooltipsFeatureOn,
) {
  const helpContent = [];
  helpContent.push('Help Management');
  isHelpContentFeatureOn &&
    helpContent.push(['Help Content', buildHelpContentUrl()]);
  isTooltipsFeatureOn && helpContent.push(['Tooltips', buildTooltipsUrl()]);
  return helpContent;
}

const locationPackage = [
  'Location Packages',
  ['Create', buildCreateLocationPackageUrl()],
  ['View All', buildLocationPackageUrl()],
];

const competitions = [
  'Competitions',
  ['Create Competition', buildCreateTimeAndLocationCompetitionUrl()],
  ['All Competitions', buildCompetitionUrl()],
];

const getTemplatesSubItems = (templates) => {
  const menuSubItems = templates.map((template) => [template.name, null]);
  return ['Competition Templates', ...menuSubItems];
};

const user = ['User Management', ['All Users', buildUserUrl()]];

function createNavItem(itemArray) {
  const item = {};
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
}

function createNavBar(
  favoriteLocations,
  locationPackages,
  currentCompetitions,
  features,
  competitionTemplates,
) {
  const locationItem = createNavItem(
    createSubNavbar(
      buildLocation(),
      createNavElement(favoriteLocations, buildUpdateLocationByIdUrl),
    ),
  );

  const locationPackagesItem = features.includes(LOCATION_PACKAGE_MANAGEMENT)
    ? [
        createNavItem(
          createLocationPackagesLocations(locationPackage, locationPackages),
        ),
      ]
    : [];

  const competitionItem = createNavItem(
    createSubNavbar(
      competitions,
      createNavElement(currentCompetitions, buildWatchOneCompetitionByIdUrl),
    ),
  );

  const userManagementItem = createNavItem(user);

  const isCompetitionTemplateFeatureOn = features.includes(
    COMPETITION_TEMPLATE_MANAGEMENT,
  );
  const templatesItem = isCompetitionTemplateFeatureOn
    ? [createNavItem(getTemplatesSubItems(competitionTemplates))]
    : [];

  const isHelpContentFeatureOn = features.includes(HELP_CONTENT_MANAGEMENT);
  const isTooltipsFeatureOn = features.includes(TOOLTIP_MANAGEMENT);
  const helpContent =
    isHelpContentFeatureOn || isTooltipsFeatureOn
      ? [
          createNavItem(
            createHelpManagementNavLinks(
              isHelpContentFeatureOn,
              isTooltipsFeatureOn,
            ),
          ),
        ]
      : [];

  return [
    createGeneralNavItem('Navigation menu', [
      locationItem,
      ...locationPackagesItem,
      competitionItem,
      ...templatesItem,
      userManagementItem,
      ...helpContent,
    ]),
  ];
}

export function createLocationPackagesLocations(
  locationPackage,
  locationPackages,
) {
  if (locationPackages) {
    return locationPackages.reduce(
      (locationsPackageList, locationPackage) => {
        locationsPackageList.push(
          createSubNavbar(
            [`🗁 ${locationPackage.name}`],
            createNavElement(
              [...locationPackage.locations],
              buildUpdateLocationByIdUrl,
            ),
          ),
        );
        return locationsPackageList;
      },
      [...locationPackage],
    );
  }
}

function createSubNavbar(itemList, itemListToAdd) {
  return itemListToAdd ? [...itemList].concat(itemListToAdd) : [...itemList];
}

export default createNavBar;
