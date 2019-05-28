import React from 'react';
import {
  View,
  TextInput
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';

const TextField = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder={placeholder}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = ScaledSheet.create({
  inputStyle: {
    color: '#000',
    paddingRight: '5@s',
    paddingLeft: '5@s',
    fontSize: '18@ms',
    lineHeight: '23@vs',
    flex: 2
  },
  labelStyle: {
    fontSize: '18@ms',
    fontWeight: '600',
    color: '#56514f',
    paddingLeft: '20@ms',
    flex: 1
  },
  containerStyle: {
    height: '40@vs',
    flex: .77,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: '2@s',
    borderColor: '#ef5a30',
    borderRadius: 4,
  },
})

export { TextField };
