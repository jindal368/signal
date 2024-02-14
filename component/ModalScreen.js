import React, { useState , useEffect} from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import  firebase from '@react-native-firebase/app';
import firestore  from '@react-native-firebase/firestore'
import { View, Text, Button,SafeAreaView , TouchableOpacity ,Image,StyleSheet , TextInput} from 'react-native'
import { useAuth } from '../hooks/useAuth';

function ModalScreen({navigation}) {
    const tw = useTailwind();
    const [profile, setProfile] = useState('');
    const [age, setAge] = useState('');
    const [occupation , setOccupation] = useState('')
    const { user } = useAuth();

    const incompleteForm = !profile || !age || !occupation
    const firstFunction = async() => {
        const userData = await firestore().collection('Users').doc(user.user.id).get();
        console.log("UserDtaa : ",userData._data)
        if (userData) {
            setAge(userData._data.age)
            setOccupation(userData._data.job)
            setProfile(userData._data.photoURL)
        }
    }
    
    useEffect(() => {
        firstFunction()
    },[])

const updateUserProfile = () => {
        
   firestore()
     .collection('Users')
       .doc(user.user.id)
         .set({
         id: user.user.id,
         name: user.user.name,
         photoURL: profile,
         job: occupation,
         age: age,
         timestamp:firestore.FieldValue.serverTimestamp()
       })
        .then(() => {
            console.log('User added!');
            navigation.navigate('HomeScreen')
        })
        .catch((err) => console.log(err))
        }

  return (
      <View style={tw('flex-1 items-center pt-1')}>
          <Image
              style={tw('h-20 w-full')}
              resizeMode='contain'
              source={{uri:'https://links.papareact.com/2pf'}}
          />
          <Text style={tw('text-xl text-gray-500 p-2 font-bold' )}>
              Welcome {user.user.name}
          </Text>

          <Text style={tw('text-center p-4 font-bold text-red-400')}>Step 1 : The Profile Pic</Text>
          <TextInput
              value={profile}
              onChangeText={text => setProfile(text)}
              placeholder='Enter Profile URL'
              style={tw('text-center text-xl pb-2')} />
          
          <Text style={tw('text-center p-4 font-bold text-red-400')}>Step 2 : The Job</Text>
          <TextInput
              value={occupation}
              onChangeText={text => setOccupation(text)}
              placeholder='Enter the occupation' style={tw('text-center text-xl pb-2')} />
          
          <Text style={tw('text-center p-4 font-bold text-red-400')}>Step 3 : The Age</Text>
          <TextInput
              value={age}
              onChangeText={text => setAge(text)}
              maxLength={2}
              keyboardType="numeric"
              placeholder='Enter your Age' style={tw('text-center text-xl pb-2')} />
          
          <TouchableOpacity
              disabled={incompleteForm}
              onPress={() => updateUserProfile()}
              style={[tw('absolute bottom-10 w-64 p-3 rounded-xl') , incompleteForm?tw('bg-gray-400'):tw('bg-red-500')]}>
              <Text style={tw('text-center text-white text-xl')}>Update Profile</Text>
          </TouchableOpacity>
    </View>
  )
}

export default ModalScreen