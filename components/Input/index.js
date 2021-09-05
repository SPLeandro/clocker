import { mask, unMask} from 'remask';

import {
    Input as InputBase, 
    FormControl, 
    FormLabel, 
    FormHelperText 
} from '@chakra-ui/react';

export const Input = ({error, touched, name, label, onChange, mask: pattern, ...props}) => {
    
    const handleChange = event => {
        const unMaskedValue = unMask(event.target.value);
        const maskedValue = mask(unMaskedValue, pattern);

        onChange && onChange(event.target.id)(maskedValue) 
    }

    return (    
        <FormControl id={name} p={4} isRequired>
            <FormLabel>{label}</FormLabel>
            <InputBase {...props} onChange={pattern ? handleChange : onChange} />
            {touched && <FormHelperText textColor="#e74c3c">{error}</FormHelperText> }
        </FormControl>
    )
}   