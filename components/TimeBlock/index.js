import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Button,
    Modal, ModalOverlay, 
    ModalContent, ModalHeader, ModalBody, ModalFooter, 
    ModalCloseButton, 

} from "@chakra-ui/react";

import {Input} from '../Input';

const ModalTimeBlock = ({isOpen, onClose, onComplete, children}) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Reservar Horário</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}
            </ModalBody>

            <ModalFooter>
                <Button mr={4} variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button colorScheme="blue" mr={3} onClick={onComplete}>Reservar horário</Button>          
            </ModalFooter>
    
        </ModalContent>
    </Modal>
)

export const TimeBlock = ({time}) => {
    const [isOpen, setIsOpen] = useState(false);

    const {values, handleSubmit, handleChange, handleBlur , errors, touched} = useFormik({
        onSubmit: () => {},
        initialValues: {
            name: '',
            phone: ''
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Preenchimento obrigatório'),
            phone: yup.string().required('Preenchimento obrigatório'),
        })
    })

    const toggle = () => setIsOpen(prevState => !prevState);

    return (
        <Button p={8} bg="blue.500" color="#fff" onClick={toggle}>
            {time}
            <ModalTimeBlock isOpen={isOpen} onClose={toggle} onComplete={handleSubmit}>
                <>
                    <Input 
                        name="name" label="Nome:" placeholder="Insira seu nome" 
                        value={values.name} onChange={handleChange} onBlur={handleBlur}
                        error={errors.name} touched={touched.name}
                        size="lg"  
                    />
                    <Input 
                        name="phone" label="Telefone:" placeholder="(XX) X XXXX-XXXX"
                        value={values.phone} onChange={handleChange}  
                        error={errors.phone}
                        size="lg"  mt={4} 
                    />
                </>
            </ModalTimeBlock>
        </Button>
    )
}