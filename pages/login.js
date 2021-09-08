import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import NextLink  from 'next/link';
import {useRouter} from 'next/router';

import { 
  Container, Box, Input, Button, Text, Link, useToast,
  FormControl, FormLabel, FormHelperText
} from '@chakra-ui/react';

import { Logo } from '../components';
import { useAuth } from '../providers';

const validationSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
});

export default function Login () {

  const {auth, signIn} = useAuth();
  const router = useRouter();
  const toast = useToast();

  const {
    values, errors, touched, isSubmitting, 
    handleChange,handleBlur, handleSubmit
  } = useFormik({
    onSubmit: async (data) => {
      try {
        const response = await signIn(data);
        toast.closeAll();

        if (response.error) {
          toast({
            title: response.error.code,
            description: response.error.message,
            status: 'error',
            duration: 10000,
            isClosable: true,
            position: 'top',
          });
        }

        if (response.user){
          toast({
            title: `Bem-Vindo!`,
            description: 'Autenticação realizada com sucesso.',
            status: 'success',
            duration: 3000,
            position: 'top',
          });
        }
      } catch (error) {
        toast({
          title: 'Houve um problema!',
          description: error,
          status: 'error',
          duration: 10000,
          position: 'top',
        });
      }
    },
    validationSchema,    
    initialValues: {
      email: '',
      password: '',
    },
  });

  useEffect(()=>{
    auth.user && router.push('/agenda');
  },[auth.user]);

  return (
    <Container p={4} flex="1" centerContent justifyContent="center">
      <Logo size={200}/>
      <Box p={4} mt={8}>
        <Text>Crie sua agenda compartilhada</Text>
      </Box>

      <Box>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input size="lg" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {touched.email && <FormHelperText textColor="#e74c3c">{errors.email}</FormHelperText> }
        </FormControl>

        <FormControl id="password" p={4} isRequired >
          <FormLabel>Senha</FormLabel>
          <Input size="lg" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
          {touched.password && <FormHelperText textColor="#e74c3c">{errors.password}</FormHelperText>}

        </FormControl>

        <Box p={4}>
          <Button colorScheme="blue" width="100%" onClick={handleSubmit} isLoading={isSubmitting}>Entrar</Button>
        </Box>

        <Text> 
          Ainda não tem uma conta? 
          <NextLink href="/signup"> 
            <Link ml={1} color="blue.500">Cadastre-se </Link>
          </NextLink>
        </Text>

      </Box>      
    </Container>
  );
}