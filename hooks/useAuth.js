
import React, { createContext  , useState , useContext , useEffect , useMemo} from 'react'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';

import firestore  from '@react-native-firebase/firestore'

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loggedIn, setloggedIn] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)
   

 
  const _signIn = async () => {
    setLoading(true)
    try {
      GoogleSignin.hasPlayServices();
      
      const resp = await GoogleSignin.signIn()
       
      console.log("response : ", resp);
      setUser(resp)
      setloggedIn(true)
        
     
      console.log("Usr : ", user);
      const credential = auth.GoogleAuthProvider.credential(
        resp.idToken, resp.serverAuthCode
      );
      console.log("Credential : ", credential);
      setLoading(false);
      return auth().signInWithCredential(credential)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
        setLoading(false);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        setLoading(false);
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        setLoading(false);
        // play services not available or outdated
      } else {
        setLoading(false)
        // some other error happened
      }
    }
  };
  function onAuthStateChanged(user) {
    
    console.log(user);
    if (user) setloggedIn(true);
    else setloggedIn(false);
    setLoadingInitial(false)
  }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '1097483691789-nkchsf6s20njj5cemmoi50m6t591bnfa.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true// if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signOut = async () => {
    try {
      setLoading(true)
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => {
          alert('Your are signed out!')
          setUser(null)
          setloggedIn(false);
        })
        
        .catch((err) => console.log("err : ", err))
        .finally(() => setLoading(false))
      
    } catch (error) {
      console.error(error);
    }
  };

  const memoedValue = useMemo(() => ({
    user,
        setUser,
        loggedIn,
        setloggedIn,
        _signIn,
        signOut,
    loading,
  
  }),[user , loading ])



  return (
    <AuthContext.Provider
      value={
        memoedValue
      }  
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}