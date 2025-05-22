export interface HeaderColumn {
  id: number | string;
  label: string;
  sticky?: boolean;
}

export interface Cell {
  id: number | string;
  value: boolean;
}

export interface Row {
  id: number | string;
  name: string;
  items: Cell[];
}

export interface updatedCell {
  organizationId: string;
  itemId: string;
  value: boolean;
}
