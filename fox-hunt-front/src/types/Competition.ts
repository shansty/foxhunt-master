import type { User } from 'src/types/User';
import type { Location } from 'src/types/Location';

export interface DistanceType {
  distanceLength: number;
  id: number;
  maxNumberOfFox: number;
  name: string;
}

export interface FoxPoint {
  coordinates: number[];
  id: number;
  index: number;
  label: string;
}

export interface Competition {
  actualStartDate: string;
  coach: User;
  createdBy: User;
  createdDate: string;
  distanceType: DistanceType;
  expectedCompetitionDuration: string;
  finishPoint: number[];
  foxAmount: number;
  foxDuration: number;
  foxRange: number;
  foxPoints: FoxPoint[];
  frequency: number;
  hasSilenceInterval: boolean;
  id: number;
  isPrivate: boolean;
  location: Location;
  name: string;
  notes: string;
  participants: User[];
  startDate: string;
  startPoint: number[];
  status: string;
  updatedDate: string;
}
