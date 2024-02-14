import { View, Text, Button } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'

const LoginScreen = ({ setUser }) => {
    const tw = useTailwind()
    return (
      <>
      <View style={tw('flex-1 justify-center items-center')}>
          <Text>LoginScreen</Text>
            </View>
            <View>

          <Button title='Login' onPress={() => setUser(true)}/>
            </View>
      </>
  )
}

export default LoginScreen