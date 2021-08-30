import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { 
  Container, Box, Input, Button, Text, 
  FormControl, FormLabel, FormHelperText, InputLeftAddon, InputGroup 
} from '@chakra-ui/react';

import { Logo, useAuth } from '../components';

const validationSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('Preenchimento obrigatório'),
  username: yup.string().required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
  // website: yup.string().url(),
  // createdOn: yup.date().default(() => {return new Date()})
});


export default function Home() {

  const {auth, signUp} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    if(auth){
      router.push('/agenda');
    }
  },[auth])

  const {
      values, errors, touched, isSubmitting, 
      handleChange,handleBlur, handleSubmit
    } = useFormik({
    onSubmit: signUp,
    validationSchema,    
    initialValues: {
      email: '',
      username: '',
      password: '',
    }

  })

  return (
    <Container p={4} centerContent>
      <Logo />
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

        <FormControl id="username" p={4} isRequired >
          <InputGroup size="lg">
           <InputLeftAddon>clocker.work</InputLeftAddon>
            <Input type="username" value={values.username} onChange={handleChange} onBlur={handleBlur} />
          </InputGroup>
          {touched.username && <FormHelperText textColor="#e74c3c">{errors.username}</FormHelperText>}
        </FormControl>

        <Box p={4}>
          <Button colorScheme="blue" width="100%" onClick={handleSubmit} isLoading={isSubmitting}>Entrar</Button>
        </Box>
      </Box>  
         
      <Link href="/"> Já possui uma conta? Faça Login</Link> 
    </Container>
  )
}
