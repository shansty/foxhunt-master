import React, { useState } from 'react';
import { FieldAttributes } from 'formik';
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { ADMIN, COACH, PARTICIPANT } from 'src/constants/roles';
import { enumStringToReadableFormat } from 'src/utils/formatUtil';
import { Role } from 'src/types/User';

export default function FormikMultiSelect({
  form,
  field,
  organizationId,
  userRoles,
  userId,
  ...props
}: FieldAttributes<any>) {
  const [error, setError] = useState(false);
  const { value: roles, name } = field;
  const { setFieldValue, initialValues } = form;
  const { roles: initialRoles } = initialValues;

  const changeValue = (value: string | string[]) => {
    setFieldValue(
      name,
      typeof value === 'string'
        ? [{ ...initialRoles[0], role: value }]
        : value.map((role: string) => ({
            ...initialRoles[0],
            role,
          })),
      true,
    );
    setError(false);
  };

  const handleRolesChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;

    value.length > 0 ? changeValue(value) : setError(true);
  };

  const label = error ? 'User must have at least one role' : 'Roles';

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
      <Select
        value={roles.map(({ role }: Role) => role)}
        multiple
        onChange={handleRolesChange}
        name={name}
        error={error}
        label={label}
        {...props}
      >
        <MenuItem value={PARTICIPANT}>
          {enumStringToReadableFormat(PARTICIPANT)}
        </MenuItem>
        <MenuItem value={COACH}>{enumStringToReadableFormat(COACH)}</MenuItem>
        {roles.find(({ role }: Role) => role.includes(ADMIN)) && (
          <MenuItem value={ADMIN}>{enumStringToReadableFormat(ADMIN)}</MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
