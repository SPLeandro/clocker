import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { 
  Container, Box, Input, Button, Text, Link,
  FormControl, FormLabel, FormHelperText, InputLeftAddon, InputGroup 
} from '@chakra-ui/react';

import { Logo } from '../components';
import { useAuth } from '../providers';

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
    auth.user && router.push('/agenda');
  },[auth.user])

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
    <Container p={4} centerContent height="100vh" justifyContent="center">
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

        <FormControl id="username" p={4} isRequired >
          <InputGroup size="lg">
           <InputLeftAddon>clocker.work</InputLeftAddon>
            <Input type="username" value={values.username} onChange={handleChange} onBlur={handleBlur} />
          </InputGroup>
          {touched.username && <FormHelperText textColor="#e74c3c">{errors.username}</FormHelperText>}
        </FormControl>

        <Box p={4}>
          <Button colorScheme="blue" width="100%" onClick={handleSubmit} isLoading={isSubmitting}>Cadastrar</Button>
        </Box>
      </Box>  
         
      <Text> 
        Já possui uma conta?
        <NextLink href="/"> 
          <Link ml={1} color="blue.500">Faça Login</Link>
        </NextLink>
      </Text>
    </Container>
  )
}
