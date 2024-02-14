import React, {useState, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useTailwind } from 'tailwind-rn/dist';
import { useNavigation } from '@react-navigation/native';
import IMG from '../assests/tinder.png'
export default GoogleSigninComp = () => {
  
  const navigation = useNavigation()
  const tw = useTailwind()
  const { loggedIn, _signIn, signOut, user, loading } = useAuth();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])


  return ( 
    <View style={tw('flex-1')}>
      <ImageBackground
        source={IMG}
        resizeMode="cover"
        style={tw('flex-1')} 
      >
        <TouchableOpacity
        onPress={() => _signIn()}  
        style={[tw('absolute bottom-40 w-52 bg-white p-4 rounded-2xl'), { marginHorizontal: '25%' }]}>

          <Text style={[tw('text-center font-bold'), {color:'red'}]}>Sign in & get Swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

