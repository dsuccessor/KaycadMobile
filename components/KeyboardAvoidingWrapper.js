/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';

function KeyboardAvoidingWrapper({children}) {
  const {width, height} = Dimensions.get('window');

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;
  const position = Platform.OS === 'ios' ? 'padding' : null;

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'transparent'}}
      behavior={position}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default KeyboardAvoidingWrapper;
