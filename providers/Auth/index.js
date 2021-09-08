import { createContext, useContext, useState, useEffect } from "react"
import { firebaseClient, persistenceMode } from "../../config/firebase/client";
import axios from 'axios';

const AuthContext = createContext([{}, ()=>{}]);

export const AuthProvider = ({children}) => {
    
  const [auth, setAuth] = useState({
    loading: true,
    user: false,
  });

  const signIn = async ({email, password}) => {
    firebaseClient.auth().setPersistence(persistenceMode);
  
    try {
      await firebaseClient.auth().signInWithEmailAndPassword(email, password);
      return {
        user: firebaseClient.auth().currentUser
      };
    } catch (error) {
      return {error};
    }
  }
  
  const signOut = async () => {
    firebaseClient.auth().signOut();
  }
  
  const signUp = async ({email, password, username}) => {
    try {
      await firebaseClient.auth().createUserWithEmailAndPassword(email, password);
      const { user } = await signIn({email, password});
        
      const token = await user.getIdToken();
      
      const { data } = await axios({
        method: 'post',
        url: '/api/profile',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        data: { username }
      });

      return {
        user: {email , username}
      };
  
    } catch (error) {
      return {error};
    }
  }

  useEffect(()=>{
    const unsubscribe = firebaseClient.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user,
      })
    });

    return () => unsubscribe();
  },[]);

  return (
    <AuthContext.Provider value={{auth, setAuth, signUp, signIn, signOut }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);