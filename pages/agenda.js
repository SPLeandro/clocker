import { useState, useEffect } from "react";
import { Container, Button, IconButton, Box, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router'
import { addDays, subDays } from "date-fns";

import { useFetch, useStateRx } from '@refetty/react';
import axios from 'axios';

import { useAuth, Logo, formatDate } from '../components';
import { getToken } from "../config/firebase/client";

const getAgenda = async (when) => { 
  const token = await getToken();

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: { when },
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
};

const Header = ({children}) =>(
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
)


export default function Agenda () {

  const router = useRouter();
  const {auth, signOut} = useAuth();
  const [when, setWhen] = useState(() => new Date());
 
  const [data, {loading, status, error }, fetch] = useFetch(getAgenda, {lazy: true});

  const addDay = () => setWhen(prevState => addDays(prevState, 1));

  const removeDay = () => setWhen(prevState => subDays(prevState, 1));
  
  useEffect(()=>{
    !auth.user && router.push('/');
  },[auth.user]);

  useEffect(()=>{
    fetch(when);
  }, [when]);

  return (
    <Container p={4}>
      <Header>
        <Logo size={180}/>
        <Button onClick={signOut}>Sair</Button>
      </Header>

      <Box mt={8} display="flex" alignItems="center">
        <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={removeDay}/>
          <Text flex={1} textAlign="center">{formatDate(when, 'PPPP')}</Text>
        <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay} />
      </Box>      
    </Container>
  )
}