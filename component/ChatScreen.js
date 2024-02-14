import { View, Text, Button , SafeAreaView } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useAuth } from '../hooks/useAuth'
import Header from './Header'
import ChatList from './ChatList'
const ChatScreen = ({ navigation }) => {
  const tw = useTailwind()
  const { user  , signOut} = useAuth()
  return (
    <SafeAreaView>
      <Header title="Chat" callEnabled />
      <ChatList/>
   
    </SafeAreaView>
  )
}

export default ChatScreen