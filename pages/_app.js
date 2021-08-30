import {ChakraProvider} from '@chakra-ui/react';
import {AuthProvider} from '../components/Auth';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  )
}

export default MyApp;
