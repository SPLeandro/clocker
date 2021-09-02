import {Input as InputBase, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

export const Input = ({error, touched, name, label, ...props}) => (
    <FormControl id={name} p={4} isRequired>
        <FormLabel>{label}</FormLabel>
        <InputBase {...props} />
        {touched && <FormHelperText textColor="#e74c3c">{error}</FormHelperText> }
    </FormControl>
)