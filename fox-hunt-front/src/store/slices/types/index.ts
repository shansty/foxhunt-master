import { PayloadAction } from '@reduxjs/toolkit';
import type { User, Invitation } from 'src/types/User';
import type { Organization } from 'src/types/Organization';
import type { Location } from 'src/types/Location';
import type { Topic } from 'src/types/HelpContent';
import type { LocationPackage } from 'src/types/LocationPackage';
import type { Notification } from 'src/types/Notification';
import type { Tooltips } from 'src/types/Tooltip';

export type AuthSliceState = {
  isSignedIn: boolean;
  error: string | null;
  loginUrl: string;
  invitation: Invitation;
  userFromInvitation: User;
  loggedUser: Partial<User>;
  organizationFromInvitation: Organization;
  resetPasswordRequest: {};
  userAfterResetPassword: User;
  domain: string;
  currentOrganization: {};
  organizationAdmin: User;
};

export type CompetitionSliceState = {
  competitions: {};
  invitations: Invitation[];
  currentCompetitions: [];
  competitionTemplates: { name: string; id: string }[];
  size: number;
  gameState: {};
};

export type DistanceTypeSliceState = {
  distanceTypes: [];
};

export type FeatureSliceState = {
  features: string[];
};

export type HelpContentSliceState = {
  helpContents: Topic[];
};

export type LocationPackagesSliceState = {
  locationPackages: { [key: string]: LocationPackage };
  locationPackage: LocationPackage;
  size: number;
};

export type LocationSliceState = {
  locations: { [key: string]: any };
  location: Location;
  favoriteLocations: Location[];
  size: number;
  isLoading?: boolean;
};

export type NotificationsSliceState = {
  notifications: Notification[];
};

export type ParticipantsSliceState = {
  participants: { [key: string]: User };
  coaches: { [key: string]: User };
};

export type ReplaySliceState = {
  trackers: [];
  size?: number;
};

export type SseSliceState = {
  [key: string]: any;
};

export type ThemeOptionsSliceState = {
  [key: string]: boolean;
};

export type TooltipsSliceState = {
  tooltips: Tooltips;
  notCreatedTooltips: Tooltips;
};

export type UsersSliceState = {
  users: { [key: string]: Partial<User> };
  user: Partial<User>;
  size?: number;
};

export type SseMeta = { identity: string; type?: string };
export type SseAction = PayloadAction<any, string, SseMeta>;
