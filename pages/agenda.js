import { useEffect } from "react";
import { Container, Button, Text } from "@chakra-ui/react";
import { useAuth } from '../components';
import { useRouter } from 'next/router'

export default function Agenda () {

  const {auth, signOut} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    !auth.user && router.push('/');
  },[auth.user])

  return (
    <Container p={4}>
      <Text>AGENDA</Text>
      <Button onClick={signOut}>Sair</Button>
    </Container>
  )
}