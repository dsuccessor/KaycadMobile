/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {Animated, Easing} from 'react-native';
import {Dialog} from '@rneui/themed';

function SplashScreen({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState('KayCad \n Academy');
  const {height, width} = Dimensions.get('window');
  const [first, setfirst] = useState('active');

  const animationProgress = useRef(new Animated.Value(0));
  const animationStart = useRef(new Animated.Value(0)).current;
  const logoStart = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({finished}) => {
      finished === true && logoShow();
    });
  }, []);

  const logoShow = () => {
    setLoading(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoStart, {
          toValue: 1,
          easing: Easing.ease,
          duration: 200,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(animationStart, {
          toValue: 1,
          easing: Easing.linear,
          duration: 200,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.parallel(
          [
            //Animated.delay(1000),
            Animated.timing(animationStart, {
              toValue: 0,
              easing: Easing.linear,
              duration: 1,
              isInteraction: false,
              useNativeDriver: true,
            }),
            Animated.timing(logoStart, {
              toValue: 0,
              easing: Easing.linear,
              duration: 1,
              isInteraction: false,
              useNativeDriver: true,
            }),
          ],
          {stopTogether: false},
        ),
      ]),
      {iterations: 3},
    ).start(({finished}) => {
      finished === true && login();
    });
  };

  const login = () => {
    setLoading(false);
    navigation.navigate('Action');
  };

  return (
    <View style={{flex: 1, alignItems: 'center', margin: 0}}>
      <LottieView
        source={require('../assets/KayCad-Splash.json')}
        //autoPlay
        loop={false}
        progress={animationProgress.current}
        resizeMode="cover"
        onAnimationFinish={() => logoShow()}
      />
      <Dialog
        isVisible={loading}
        overlayStyle={{
          width: width,
          height: height,
          //backgroundColor: '#a4bafa',
          backgroundColor: '#fff',
          paddingVertical: '90%',
        }}>
        {/* <LottieView
          //source={require('../assets/cycling-blue-loader.json')}
          source={require('../assets/Loader.json')}
          autoPlay
          loop={true}
          // onAnimationFinish={() => {
          //   setLoading(true);
          //   navigation.navigate('Login');
          // }}
        /> */}
        <Animated.View
          style={{
            flex: 1,
          }}>
          <Animated.Image
            style={[
              styles.loader,
              {
                opacity: logoStart.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
                borderRadius: 10,
              },
              first === 'active' && {
                transform: [
                  {
                    translateX: animationStart.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -95],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    translateY: logoStart.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
            source={require('../../images/logo.png')}
          />

          <Animated.Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 25,
              color: 'rgb(230, 245, 255)',
              marginTop: 20,
              position: 'relative',
              marginLeft: '10%',
              zIndex: 9,
              top: -85,
              opacity: animationStart.interpolate({
                inputRange: [0, 1],
                outputRange: [-70, 10],
                extrapolate: 'clamp',
              }),
              shadowColor: 'blue',
              shadowRadius: 1,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowOpacity: 0.8,
            }}>
            {brand}
          </Animated.Text>
        </Animated.View>

        <Text
          style={{
            fontSize: 12,
            color: 'black',
            position: 'absolute',
            bottom: '30%',
            textAlign: 'center',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          A Smart Student Portal for Institutions
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: 'blue',
            position: 'absolute',
            bottom: '20%',
            textAlign: 'center',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          with medium functionality & User friendliness!
        </Text>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginTop: '15%',
    marginLeft: '10%',
  },
});

export default SplashScreen;
