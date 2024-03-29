import { View, Text ,Image} from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'

const Receivermessage = ({ message}) => {
  const tw = useTailwind()
  console.log("Messss : ",message);
  return (
    <View
      style={[tw('bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14'), { alignSelf: 'flex-start'}]}
    >
      <Image source={{uri : message?.photoURL}} style={tw('h-12 w-12 rounded-full absolute top-0 -left-14')} />
      <Text style={tw('text-white')}>{message?.message}</Text>
    </View>
  )
}

export default Receivermessage