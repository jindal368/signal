import { View, Text ,TouchableOpacity , Image , StyleSheet} from 'react-native'
import React , {useState ,useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../hooks/useAuth'
import getMatchedUserInfo from '../utils/getMatchedUserInfo'
import { useTailwind } from 'tailwind-rn/dist'
import firestore  from '@react-native-firebase/firestore'

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation()
    const { user } = useAuth()
  const [matchedUserInfo, setMatchedUserInfo] = useState(null)
  const [lastMessage, setLastMessage] = useState('Say hii !!!')
  const [lastMessageByMatcher, setLastMessageByMatcher] = useState(false)
  const tw = useTailwind()
  
  useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users , user.user.id))
    }, [matchDetails, user])
  
  useEffect(() => {
    let unsub

    const lastMessageFetch = async() => {
    unsub =  await firestore().collection('Matched')
        .doc(matchDetails.id)
      .collection('Messages').orderBy('timestamp', 'desc').onSnapshot((snap) => {
        if (snap?.docs[0]?._data?.id !== user.user.id) {
             setLastMessageByMatcher(true)
        }
        else {
          setLastMessageByMatcher(false)
        }
              setLastMessage(snap.docs[0]?._data?.message)
              return
            })
    }
    lastMessageFetch()
    return unsub
    },[matchDetails])

  return (
      <TouchableOpacity
          style={[tw('flex-row items-center py-2 px-5 bg-white mx-3 my-1 rounded-lg'), styles.cardShadow]}
          onPress={() => navigation.navigate('MessageScreen', {matchDetails} 
        )}
          >
          <Image
              style={tw('rounded-full h-16 w-16 mr-4')}
           source={{uri:matchedUserInfo?.photoURL}}
          />
          <View>
          <Text style={tw('text-lg font-semibold')}>
                  {matchedUserInfo?.name}
            </Text>
              <Text style={lastMessageByMatcher?tw('font-bold text-xl' ):tw('')}>{lastMessage}</Text>
          </View>
   </TouchableOpacity>
  )
}

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height:1
      },
      shadowOpacity: 0.2,
      shadowOpacity: 1.41,
      elevation:2
      
    }
  })