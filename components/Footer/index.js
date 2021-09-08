import {Container, Box, Divider, Text, Button, Link} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const Footer =  (props) => {
    return (
        <>
        <Divider />
        <Container p={2} display="flex" centerContent>
            <Box textAlign="center">
                <Text fontSize="md">Developed by Leandro Santos</Text>
                
                <Button variant="link" fontSize="sm" textAlign="center">
                    <Link href="https://github.com/SPLeandro" isExternal display="flex" alignItems="center">
                        github.com/SPLeandro 
                        <ExternalLinkIcon mx="2px" />
                    </Link>
                </Button>
            </Box>         
        </Container>
        </>
    )
}