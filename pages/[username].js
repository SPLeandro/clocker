import { useState, useEffect } from "react";
import { Container, IconButton, Box, Flex, Text, SimpleGrid, Spinner} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router'
import { addDays, subDays, format } from "date-fns";

import { useFetch} from '@refetty/react';
import axios from 'axios';

import { formatDate, Logo, TimeBlock } from '../components';

const getSchedule = async ({when, username}) => axios({
  method: 'get',
  url: '/api/schedule',
  params: { 
    date: format(when, 'yyyy-MM-dd'), 
    username
  },
})

const Header = ({children}) =>(
  <Box p={4} display="flex" alignItems="center" justifyContent="center">
    {children}
  </Box>
)


export default function Schedule () {

  const router = useRouter();
  const [when, setWhen] = useState(() => new Date());
  const [data, {loading}, fetch] = useFetch(getSchedule, {lazy: true});
  

  const addDay = () => setWhen(prevState => addDays(prevState, 1));
  const removeDay = () => setWhen(prevState => subDays(prevState, 1));

  const refresh= () => {
    fetch({when, username: router.query.username});
  }

  useEffect(()=>{
    refresh();
  }, [when, router.query.username]);

  return (
    <Container p={4} flex="1" justifyContent="center">
      <Header>
        <Logo size={180}/>
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

      <SimpleGrid p={4} columns={2} spacing={4}>
        {data?.map(({time, isBlocked})=> <TimeBlock key={time} time={time} date={when} disabled={isBlocked} onSuccess={refresh}/>)}
      </SimpleGrid>

    </Container>
  )
}