/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

function SideBar(props, mydata) {
  const [input, setInput] = useState();

  AsyncStorage.getItem('@activeUser').then(user => {
    let data = JSON.parse(user);
    setInput(data);
    //console.log(`async strage = ${data}`);
  });

  const activeUser = input;
  //const {activeUser} = mydata;
  //console.log(`async storage 2 = ${input}`);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: 'transparent',
        }}>
        <ImageBackground
          source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
          style={[StyleSheet.absoluteFill, {padding: 20}]}
        />
        <Image
          source={{
            uri: activeUser?.passport,
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginLeft: 20,
            marginBottom: 10,
          }}
        />
        <Text
          style={{
            marginBottom: 5,
            marginLeft: 20,
            fontSize: 15,
            fontWeight: 'bold',
            color: 'white',
            //fontFamily: 'Roboto-Medium',
          }}>
          {activeUser?.surname?.toUpperCase()}, {activeUser?.otherName}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              marginBottom: 10,
              marginLeft: 20,
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.8)',
              marginRight: 10,
              //fontFamily: 'Roboto-Medium',
            }}>
            15, Iyemoja Str., {'\n'} Mafoluku, Oshodi, Lagos
          </Text>
          <FontAwesome5Icon
            style={{
              paddingTop: 17,
              alignSelf: 'flex-start',
              color: '#fff',
            }}
            name="map-pin"
            size={14}
            color="white"
          />
        </View>
        <View style={{flex: 1, backgroundColor: 'white', paddingVertical: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity
          onPress={() => Alert.alert('Feedback', 'Coming soon')}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome5Icon name="share-alt" size={18} solid={false} />
            <Text style={{fontSize: 13, marginLeft: 10, fontWeight: '600'}}>
              Refer a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Alert.alert('Feedback', 'Coming soon')}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome5Icon name="sign-out-alt" size={18} solid={false} />
            <Text style={{fontSize: 13, marginLeft: 10, fontWeight: '600'}}>
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SideBar;
