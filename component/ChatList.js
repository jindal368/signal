import { View, Text ,FlatList} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTailwind } from 'tailwind-rn/dist'
import firestore  from '@react-native-firebase/firestore'
import ChatRow from './ChatRow'

const ChatList = () => {
    const [matches, setMatches] = useState([])
    const { user } = useAuth()
    const tw = useTailwind()

    
    useEffect(() => {
        firestore().collection('Matched')
            .where('userMatched', 'array-contains', user.user.id)
            .onSnapshot((snap) => setMatches(snap._docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))))
    },[user])
    
    
    return (
        matches.length > 0 ? (
            
            <FlatList
                style={tw('h-full')}
                data={matches}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ChatRow matchDetails={ item}/>}
            />
        ) :
            (
                <View style={tw('p-5')}>
                    <Text style={tw('text-center text-lg')}>No Matches at that moment.</Text>
                </View>
            )
  )
}

export default ChatList