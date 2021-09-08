import { useState, useEffect } from "react";
import { Container, Button, IconButton, Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router'
import { addDays, subDays, format } from "date-fns";

import { useFetch } from '@refetty/react';
import axios from 'axios';

import { Logo, formatDate } from '../components';
import {useAuth } from '../providers';
import { getToken } from "../config/firebase/client";

const getAgenda = async (when) => { 
  const token = await getToken();

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: { date: format(when, 'yyyy-MM-dd'),  },
    headers:{
      Authorization: `Bearer ${token}`,
      
    }
  })
};

const Header = ({children}) =>(
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
)

const AgendaBlock = ({time, name, phone, ...props}) => (
  <Box {...props} display="flex" bg={name == "Disponível" ? 'green.200' : 'gray.100'} borderRadius={8} p={4} alignItems="center">
    <Box flex={1}>
      <Text fontSize="2xl">
        {time}
      </Text>
    </Box>
    <Box textAlign="right">
      <Text fontSize="2xl">{name}</Text>
      <Text>{phone}</Text>
    </Box>
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
    <Container p={4} flex="1" justifyContent="center">
      <Header>
        <Logo size={180}/>
        <Button onClick={signOut}>Sair</Button>
      </Header>

      <Box mt={8} display="flex" alignItems="center">
        <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={removeDay}/>
          <Text flex={1} textAlign="center">{formatDate(when, 'PPPP')}</Text>
        <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay} />
      </Box>    

      {loading && 
        <Flex justifyContent="center" mt={4}>
          <Spinner tickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Flex>
      }  

      <Box display="flex" flexDirection="column" justifyContent="center" mt={4}>        
        {data?.map( doc => (
          <AgendaBlock key={doc.time} time={doc.time} name={doc.name} phone={doc.phone} m={1} />
        ))}
      </Box>     
  
    </Container>
  )
}