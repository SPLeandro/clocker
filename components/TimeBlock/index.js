import { useState } from "react";
import { useFormik } from 'formik';
import { format } from "date-fns";
import {Input} from '../Input';
import axios from "axios";
import * as yup from 'yup';
import {
    Button,
    Modal, ModalOverlay, 
    ModalContent, ModalHeader, ModalBody, ModalFooter, 
    ModalCloseButton, 
} from "@chakra-ui/react";

const setSchedule = async ({date, ...data}) => axios({
    method: 'post',
    url: '/api/schedule',
    data: { 
        ...data, 
        date: format(date, 'yyyy-MM-dd'),
        username: window.location.pathname.replace('/',''),
    }
})

const ModalTimeBlock = ({isOpen, onClose, onComplete, isSubmitting, children}) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Reservar Horário</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}
            </ModalBody>

            <ModalFooter>
                {!isSubmitting && <Button mr={4} variant="ghost" onClick={onClose}>Cancelar</Button>}
                <Button colorScheme="blue" mr={3} onClick={onComplete} isLoading={isSubmitting}>
                    Reservar horário
                    </Button>          
            </ModalFooter>
    
        </ModalContent>
    </Modal>
)

export const TimeBlock = ({time, date, disabled}) => {
    const [isOpen, setIsOpen] = useState(false);

    const {values, handleSubmit, handleChange, handleBlur , errors, touched, isSubmitting} = useFormik({
        onSubmit: async (values) => {
            try {
                await setSchedule({ ...values, time, date });
                toggle();
            } catch (error) {
                console.log(error);
                toggle();
            }
        },
        initialValues: {
            name: '',
            phone: '',
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Preenchimento obrigatório'),
            phone: yup.string().required('Preenchimento obrigatório'),
        })
    })

    const toggle = () => setIsOpen(prevState => !prevState);

    return (
        <Button p={8} bg="blue.500" color="#fff" onClick={toggle} disabled={disabled}>
            {time}
            {!disabled &&
                <ModalTimeBlock 
                    isSubmitting={isSubmitting} 
                    isOpen={isOpen} 
                    onClose={toggle} 
                    onComplete={handleSubmit}
                >
                    <>
                        <Input 
                            name="name" label="Nome:" placeholder="Insira seu nome" 
                            value={values.name} onChange={handleChange} onBlur={handleBlur}
                            error={errors.name} touched={touched.name}
                            size="lg"  
                            disabled={isSubmitting}
                        />
                        <Input 
                            label="Telefone:" 
                            name="phone"  
                            placeholder="(XX) X XXXX-XXXX"
                            value={values.phone} onChange={handleChange} onBlur={handleBlur} 
                            mask={['(99) 9999-9999', '(99) 9 9999-9999']}
                            error={errors.phone}
                            size="lg"  mt={4} 
                            disabled={isSubmitting}
                        />
                    </>
                </ModalTimeBlock>
            }
        </Button>
    )
}