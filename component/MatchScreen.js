import { View, Text , TouchableOpacity ,Image} from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useRoute } from '@react-navigation/core'

const MatchScreen = ({ navigation}) => {
  const { params } = useRoute();
  const tw = useTailwind()
  const {loggedInProfile , swipedUserData} = params
  return (
    <View style={[tw('h-full bg-red-500 pt-2') , {opacity:0.89}]}>
     
      <View style={tw('justify-center px-10 pt-20')}>
        <Image style={tw('h-20 w-full rounded-full ')} source={{uri:'https://links.papareact.com/mg9'}} />
      </View>
      
      <Text style={tw('text-white text-center mt-5')}>
        You and { swipedUserData.name} have liked each other.
      </Text>

      <View style={tw('flex-row justify-evenly mt-5')}>
        <Image
          style={tw('h-32 w-32 rounded-full')}
          source={{uri: loggedInProfile.photoURL}}
        />

        <Image
          style={tw('h-32 w-32 rounded-full')}
          source={{uri: swipedUserData.photoURL}}
        />
      </View>

      <TouchableOpacity
        style={tw('bg-white m-5 px-10 py-8 rounded-full mt-20')}
        onPress={() => {
          navigation.goBack()
          navigation.navigate('ChatScreen')
        }}
      >
        <Text style={tw('text-center')}>Send a Message</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MatchScreen