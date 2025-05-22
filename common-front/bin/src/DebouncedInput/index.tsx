import React, { useEffect, useRef, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

export interface DebouncedInputProps {
  label: string;
  onChange: (search: { name: string }) => void;
  onFinish: (inputValue: string) => void;
  timeout?: number;
  value: { name: string };
}

export function DebouncedInput({
  label,
  onChange,
  onFinish,
  timeout,
  value,
}: DebouncedInputProps) {
  const searchData = useRef(
    debounce(async (inputValue: string) => {
      onFinish(inputValue);
    }, timeout),
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = e.target.value.replace(/^\s+/g, '');
    onChange({ ...value, name: inputValue });
    searchData(inputValue);
  };

  useEffect(() => {
    return () => {
      searchData.cancel();
    };
  }, []);

  return (
    <TextField
      label={label}
      onChange={handleChange}
      size={'small'}
      value={value.name}
      variant="outlined"
    />
  );
}
