import { View, Text , TouchableOpacity } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, callEnabled }) => {
    const tw = useTailwind();
    const navigation = useNavigation()
  return (
    <View style={tw('p-2 flex-row items-center justify-between mr-0')}>
          <View style={tw('flex flex-row items-center ')}>
              <TouchableOpacity style={tw('p-2')} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back-outline" size={34} color='#FF5864' />

              </TouchableOpacity>    
              <Text style={tw('text-2xl font-bold pl-2')}>{ title}</Text>              
          </View>
          
          {callEnabled && (
              <TouchableOpacity style={tw('rounded-full mr-4 p-3 bg-red-200')}>
                  <Foundation style={ tw() } name='telephone' size={20} color='red'/>
              </TouchableOpacity>
          )}
    </View>
  )
}

export default Header