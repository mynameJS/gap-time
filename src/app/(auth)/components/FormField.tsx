import { Box, Text, Input, InputProps } from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FormFieldProps extends InputProps {
  label: string;
  isRequired?: boolean;
  error?: string;
  children?: ReactNode;
  placeholder?: string;
}

export default function FormField({ label, isRequired = false, error, children, ...inputProps }: FormFieldProps) {
  return (
    <Field.Root required={isRequired}>
      <Field.Label>
        {label} {isRequired && <Field.RequiredIndicator />}
      </Field.Label>

      {children ? <>{children}</> : <Input {...inputProps} />}

      {error && (
        <Box minH="16px" mt={1}>
          <Text fontSize="12px" color="red.500">
            {error}
          </Text>
        </Box>
      )}
    </Field.Root>
  );
}
