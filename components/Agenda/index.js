import {firebaseClient} from '../../config/firebase/client';
import { Container, Button, Text } from "@chakra-ui/react";

export const Agenda = () => {

  const signOut = () => firebaseClient.auth().signOut();

  return (
    <Container p={4}>
      <Text>AGENDA</Text>
      <Button onClick={signOut}>Sair</Button>
    </Container>
  )
}
  