import type { Location } from 'src/types/Location';

export interface LocationPackage {
  accessType: string;
  assignmentType: string;
  center: number[];
  coordinates: any;
  createdBy: { firstName: string; lastName: string };
  creationDate: string;
  description: string;
  exactAreaMatch: boolean;
  locationPackageId?: number;
  locations: Location[];
  name: string;
  updateDate: string;
  updatedBy: { firstName: string; lastName: string };
  zoom: number;
}
