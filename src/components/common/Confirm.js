import React, { Component } from 'react';
import { Text, View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { CardSection } from './CardSection';
import { Button } from './Button';
import { Section } from './Section';
import { SignupSection } from './SignupSection';
import { ModalOptions } from './ModalOptions';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

const Confirm = ({ children, title, visible, onAccept, onDecline, onClose }) => {
  const { containerStyle, cardSectionStyle, textStyle, modalViewStyle, childrenView } = styles;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <TouchableWithoutFeedback onPress={onAccept}>
        <View style={containerStyle}>

          <View style={modalViewStyle}>

            <SignupSection style={cardSectionStyle}>
              <Text style={textStyle}>{title}</Text>
            </SignupSection>

            <View style={childrenView}>
              {children}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles =  ScaledSheet.create({
  cardSectionStyle: {
    justifyContent: 'center',
    backgroundColor: '#2BA888'
  },
  textStyle: {
    flex: 1,
    fontSize: '26@ms',
    color: '#fff',
    textAlign: 'center',
    lineHeight: '40@vs',
    marginLeft: '10@s',
    marginRight: '10@s',
    fontFamily: 'Roboto-Medium'
  },
  containerStyle: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  modalViewStyle: {
    width: '390@s',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#000'
  },
  childrenView: {
    backgroundColor: '#fff',
  }
});

export { Confirm };
