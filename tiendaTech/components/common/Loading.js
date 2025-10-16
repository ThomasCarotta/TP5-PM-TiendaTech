// components/common/Loading.js
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

const Loading = ({ 
  size = 'large', // 'small' | 'large'
  color = colors.primary,
  text,
  textStyle,
  containerStyle,
  overlay = false 
}) => {
  return (
    <View style={[
      styles.container,
      overlay && styles.overlay,
      containerStyle
    ]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default Loading;