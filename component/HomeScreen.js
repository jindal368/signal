import { View, Text, Button,SafeAreaView , TouchableOpacity ,Image,StyleSheet , Animated} from 'react-native'
import React, { useLayoutEffect, useRef , useEffect , useState} from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useAuth } from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

import firestore  from '@react-native-firebase/firestore'
import Swiper from 'react-native-deck-swiper';
import GenerateId from '../utils/GenerateId';

const HomeScreen = ({navigation }) => {
  
  const tw = useTailwind()
  const { user, setUser, signOut  } = useAuth()
  const [publicUserData , setPublicUserData] = useState(null) 

  

  const swipeRef = useRef({})
  
  useLayoutEffect(() => {
    firestore()
    .collection('Users')
    .doc(user.user.id)
      .onSnapshot(snapshot => {
       console.log("snap : ",snapshot);
      if(snapshot?._data === undefined) navigation.navigate('ModalScreen')
      });
    
  },[])

  useEffect(() => {
    let unsub

   

    const firstFunctionToRun = async () => {
      
      const passedUsers =await firestore().collection('Users').doc(user.user.id).collection('passes').get().then((snap) =>  snap._docs.map((doc) =>
          doc._data.id
        ))
      
      const swipedUsers =await firestore().collection('Users').doc(user.user.id).collection('swiped').get().then((snap) => 
        
        snap._docs.map((doc) => doc._data.id)
      )
  
      
  
      const passedUsersIds = passedUsers?.length ? passedUsers : ['test']
      const swipedUsersIds = swipedUsers?.length ? swipedUsers : ['test']
      
      console.log("passes users by current user",passedUsersIds);
      console.log("Swiped users by current user", swipedUsersIds);
      



      unsub = await firestore().collection('Users').where('id', 'not-in',[...passedUsersIds , ...swipedUsersIds]).onSnapshot(res => {
       console.log("res : ",res);
       setPublicUserData(res._docs.filter(doc => doc.id !== user.user.id).map((doc) =>({
         id: doc.id,
             ...doc._data
        })))
      })
    }

    firstFunctionToRun()

    return unsub
  }, [])
  
  const swipedLeft = async(index) => {
    if (!publicUserData[index]) return
    
    console.log(`swiped with ${publicUserData[index].name}`);
   await firestore()
    .collection('Users').doc(user.user.id).collection('passes')
      .doc( publicUserData[index].id)
        .set(publicUserData[index])
      
  }
  

  const swipedRight = async(index) => {
    if (!publicUserData[index]) return
    
    console.log(`swiped with ${publicUserData[index].name}`);

    const swipedUserData = publicUserData[index]
    const loggedInProfile = await (await firestore().collection('Users').doc(user.user.id).get()).data();
   
    //checking if user swiped on me earlier

    firestore().collection('Users').doc(publicUserData[index].id).collection('swiped').doc(user.user.id).get().then((snap) => {
      console.log("Snap hoghlifht : ",snap);
      if (snap?._data?.id !== undefined) {
        console.log(`Hurray ! you have matched with ${publicUserData[index].name}`);

        // here user matched now create a matched collection
         firestore().collection('Matched').doc(GenerateId(user.user.id, publicUserData[index].id)).set({
          users: {
            [user.user.id]: loggedInProfile,
            [publicUserData[index].id] : publicUserData[index]
          },
          userMatched:[user.user.id , publicUserData[index].id]
         })
        navigation.navigate('MatchScreen', {
          loggedInProfile,
         swipedUserData
        })
      }
      else {
        console.log(`You swiped with ${publicUserData[index].name}`);
      }
    })

   await firestore()
    .collection('Users').doc(user.user.id).collection('swiped')
      .doc( publicUserData[index].id)
        .set(publicUserData[index])
      
  }
  return (
    <SafeAreaView style={tw('flex-1')}>
      <View  style={tw('items-center justify-between flex-row px-5 pt-3 ')}>
        <TouchableOpacity onPress={() => signOut()}>
          <Image style={tw('h-10 w-10 rounded-2xl')}  source={{ uri: user.user.photo}} alt="profile"/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigation.navigate('ModalScreen')}>
          <Image style={tw('h-14 w-14')} source={require('../assests/logo.png')}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
          <Icon name="chatbubbles" size={ 30} color="red"/>
        </TouchableOpacity>
      </View>
   
      {
        publicUserData === null ? <View />
          :

      <Animated.View style={tw('flex-1 -mt-6')}>
        <Swiper
          ref={swipeRef}
        containerStyle={{backgroundColor:'transparent'}}
          cards={publicUserData}
          cardIndex={0}
          verticalSwipe={false}
          stackSize={5}
          animateCardOpacity
          onSwipedLeft={(index) => {
                console.log("left")
                swipedLeft(index)
              }
          }
          onSwipedRight={(index) => {
               swipedRight(index)
               console.log("right")
              }
          }
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color:'red'
                }
              }
            },
            right: {
              title: "MATCHED",
              style: {
                label: {
                  textAlign: "left",
                  color:'green'
                }
              }
            }
          }}
              renderCard={card =>
                
                card ? (
          
          <View key={card?.id} style={tw('bg-white relative h-3/4 rounded-xl')}>
                    { console.log("Card : ",card)}
            <Image style={tw('top-0 absolute h-full w-full rounded-xl')} source={{uri: card?.photoURL}}/>
            <View style={[tw(' flex-row px-6 py-2 bg-white h-20 w-full absolute bottom-0 items-center justify-between rounded-b-xl') , styles.cardShadow]}>
              <View style={tw('')}>
                <Text style={tw('text-xl font-bold')} >{ card?.name}</Text>
                <Text>{ card?.job}</Text>
              </View>
              <Text style={tw('text-2xl font-bold pt-3')}>{card?.age}</Text>
              </View>
          </View>
              )
                : (
                  <View style={[tw('bg-white relative h-3/4 rounded-xl justify-center items-center') , styles.cardShadow]}>
                    <Text style={tw('font-bold pb-5')}>No More Profiles.</Text>
                    <Image
                      style={tw('h-20 w-full')}
                      height={100}
                      width={100}
                      source={{uri:'https://links.papareact.com/6gb'}}
                    />
                  </View>
                )}
        />
      </Animated.View>
      }
      <View style={tw('flex-row justify-evenly flex mb-3')}>

      <TouchableOpacity onPress={() => swipeRef.current.swipeRight()} style={tw('items-center justify-center rounded-full h-16 w-16 bg-red-200')} >
          <Entypo name="cross" size={ 24} color="red"/>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()} style={tw('items-center justify-center rounded-full h-16 w-16 bg-green-200')} >
          <Icon name="ios-heart-sharp" size={ 24} color="green"/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

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