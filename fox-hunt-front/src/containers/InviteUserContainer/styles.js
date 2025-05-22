import {
  styled,
  TextField,
  DialogTitle,
  FormControl,
  Select,
  outlinedInputClasses,
} from '@mui/material';

export const StyledTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: theme.spacing(2.5),
  paddingTop: theme.spacing(4),
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2.5),
  fontSize: 13,
}));

export const ErrorMessage = styled('div')(({ theme }) => ({
  height: 20,
  paddingTop: 5,
  textAlign: 'center',
  fontSize: 13,
  color: theme.palette.error.main,
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.divider,
  },
  [`& .${outlinedInputClasses.root}.Mui-focused .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: theme.palette.helpers.inputFocusedLight,
    },
  '& label': {
    color: theme.palette.helpers.labelText,
    fontSize: 13,
    '&:focused': {
      color: theme.palette.helpers.inputFocusedLight,
    },
  },
  [`& .${outlinedInputClasses.input}`]: {
    color: theme.palette.text,
    fontSize: 13,
  },
  [`& .${outlinedInputClasses.root} fieldset`]: {
    borderRadius: theme.shape.borderRadius,
  },
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.divider,
  },
  [`& .${outlinedInputClasses.root}.Mui-focused .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: theme.palette.helpers.inputFocusedLight,
    },
  '& label': {
    color: theme.palette.helpers.labelText,
    fontSize: 13,
    '&:focused': {
      color: theme.palette.helpers.inputFocusedLight,
    },
  },
  [`& .${outlinedInputClasses.input}`]: {
    color: theme.palette.text,
    fontSize: 13,
  },
  [`& .${outlinedInputClasses.root} fieldset`]: {
    borderRadius: theme.shape.borderRadius,
  },
}));

export const FormActions = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'relative',
}));
