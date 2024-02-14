// In App.js in a new project

import  React,{useState , useContext} from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  {useAuth}  from './hooks/useAuth';
import ChatScreen from './component/ChatScreen';
import HomeScreen from './component/HomeScreen';
import ModalScreen from './component/ModalScreen';
import GoogleSignIn from './component/GoogleSignIn';
import { ActivityIndicator } from 'react-native'
import { useTailwind } from 'tailwind-rn/dist'
import MatchScreen from './component/MatchScreen';
import MessageScreen from './component/MessageScreen';
// import CallScreen from './component/CallScreen';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const  {user , setUser,loading} = useAuth()
  const tw = useTailwind()
  console.log("User l ",user);
  return (
    loading ?
      <View style={ tw('flex-1 justify-center items-center')} >
        <ActivityIndicator color={"black"} size={"large"} />
        <Text>Loading.......</Text>
      </View>
      :
     <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
          headerShown:false
        }}
        >

        {
          user !==null?
              <> 
                <Stack.Group>
                  <Stack.Screen name="HomeScreen" >{(props) => <HomeScreen {...props} /> }</Stack.Screen>
                  <Stack.Screen name="ChatScreen" >{(props) => <ChatScreen {...props} />}</Stack.Screen>
                  <Stack.Screen name="MessageScreen" >{(props) => <MessageScreen {...props} /> }</Stack.Screen>
                </Stack.Group>

                <Stack.Group screenOptions={{presentation:'formSheet'}}>
                  <Stack.Screen name="ModalScreen" >{(props) => <ModalScreen {...props}/>}</Stack.Screen>
                </Stack.Group>

                <Stack.Group screenOptions={{presentation:'transparentModal'}}>
                  <Stack.Screen name="MatchScreen" >{(props) => <MatchScreen {...props}/>}</Stack.Screen>
                </Stack.Group>
                {/* <Stack.Group screenOptions={{presentation:'transparentModal'}}>
                  <Stack.Screen name="CallScreen" >{(props) => <CallScreen {...props}/>}</Stack.Screen>
                </Stack.Group> */}

              </>
        :
          <Stack.Screen name="LoginScreen" >{(props) => <GoogleSignIn  {...props} /> }</Stack.Screen>
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;


