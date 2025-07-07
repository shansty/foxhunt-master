import { Field, FieldAttributes, useField } from 'formik';

export function FormikInput({
  component,
  enableFeedback = false,
  name,
  ...props
}: FieldAttributes<any>) {
  const [field, meta, helpers] = useField(name);
  const RESERVED_SPACE: string = ' ';
  const errorMsg: string = meta.error || RESERVED_SPACE;

  return (
    <Field
      component={component}
      error={enableFeedback && !!meta.error}
      field={field}
      helpers={helpers}
      helperText={enableFeedback && errorMsg}
      meta={meta}
      name={name}
      {...props}
    >
      {props.children}
    </Field>
  );
}
