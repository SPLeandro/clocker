import firebase from '../../config/firebase';
import { Container, Button, Text } from "@chakra-ui/react";

export const Agenda = () => {

  const signOut = () => firebase.auth().signOut();

  return (
    <Container p={4}>
      <Text>AGENDA</Text>
      <Button onClick={signOut}>Sair</Button>
    </Container>
  )
}
  