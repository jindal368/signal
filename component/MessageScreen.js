import { View, Text ,SafeAreaView, TextInput,FlatList,KeyboardAvoidingView , TouchableWithoutFeedback , Keyboard, Button , Image , TouchableOpacity} from 'react-native'
import React , {useState , useEffect} from 'react'
import Header from './Header'
import { useAuth } from '../hooks/useAuth'
import getMatchedUserInfo from '../utils/getMatchedUserInfo'
import { useRoute } from '@react-navigation/core'
import { useTailwind } from 'tailwind-rn/dist'
import SenderMessage from './SenderMessage'
import Receivermessage from './Receivermessage'
import firestore  from '@react-native-firebase/firestore'
import { NavigationContainer } from '@react-navigation/native'

const MessageScreen = () => {
    const tw = useTailwind()
    const { user } = useAuth()
    const { params } = useRoute()
    const [input, setInput] = useState('')
    const [messages , setMessages] = useState([]) 
    const { matchDetails } = params

    useEffect(() => {
            let unsub
        const fetchMessages = async() => {
          unsub =  await firestore().collection('Matched')
                .doc(matchDetails.id)
              .collection('Messages').orderBy('timestamp', 'desc').onSnapshot((snap) => {
                  console.log("Message Snap : ",snap);
                  setMessages(snap._docs.map(doc => ({
                      id: doc.id,
                    ...doc._data
                })))
              })
        }
        fetchMessages()
        console.log("Messages : ", messages);
        
        return unsub

    },[sendMessage])

    
    const sendMessage =  () => {
        
        firestore().collection('Matched')
            .doc(matchDetails.id)
            .collection('Messages').doc(Date.now().toString())
           .set({
                userId: user.user.id,
               message: input,
               displayName: user.user.name,
                photoURL: matchDetails.users[user.user.id].photoURL,
               timestamp: firestore.FieldValue.serverTimestamp(),
                
           }).then(() => {
               setInput('')
            console.log('Message Sent !!');
            
        })
        .catch((err) => console.log("EEEEEEEEEE : ",err))
        }
    
  return (
      <SafeAreaView style={tw('flex-1')}>
          <View style={tw('p-2 flex-row items-center justify-between')}>

          <Header
                  title={getMatchedUserInfo(matchDetails?.users, user.user.id).name} />
              <TouchableOpacity onPress={() => navigation.navigate('CallScreen',{matchDetails})}>
          <Image
              style={tw('rounded-full h-12 w-12 mr-4')}
           source={{uri:getMatchedUserInfo(matchDetails?.users, user.user.id)?.photoURL}}
          />
              </TouchableOpacity>    
          </View>
          <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={tw('flex-1')}
              keyboardVerticalOffset={10}
          >

              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <FlatList
                      data={messages}
                      inverted={-1}
                      style={tw('pl-4')}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => 
                                
                          item?.userId === user.user.id
                              ?
                              (<SenderMessage key={item?.id} message={item} />)
                                  :
                              (<Receivermessage key={item?.id} message={item}/>)
                      
                          
                    }
                  />
                 
              </TouchableWithoutFeedback>  

           <View
          style={tw('flex-row justify-between items-center border-t border-gray-200 px-5 py-2')}
          >
              <TextInput
                  style={tw('h-10 text-lg')}
                  placeholder="Send Message..."
                  onChangeText={setInput}
                  onSubmitEditing={() => sendMessage()}
                  value={input}
                  />

              <Button title='Send' onPress={() =>  sendMessage()} color='#FF5864' />
          </View>
                  </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessageScreen