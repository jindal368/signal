import {TailwindProvider} from 'tailwind-rn';

import { NavigationContainer } from '@react-navigation/native';
import {AuthProvider} from './hooks/useAuth';
import React from 'react'
import utilities from './tailwind.json';  
import StackNavigator from './StackNavigator';
export default App = () => {
  return(
    <TailwindProvider utilities={utilities}>
      <AuthProvider>
        
    <StackNavigator/>
     </AuthProvider>
      
    </TailwindProvider>
  )
}