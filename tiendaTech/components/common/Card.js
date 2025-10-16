// components/common/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

const Card = ({ 
  children, 
  variant = 'default', // 'default' | 'outline' | 'elevated'
  padding = 'medium', // 'none' | 'small' | 'medium' | 'large'
  margin = 'none', // 'none' | 'small' | 'medium' | 'large'
  style,
  ...props 
}) => {
  const getCardStyle = () => {
    let baseStyle = styles.card;
    
    // Variantes
    if (variant === 'default') baseStyle = { ...baseStyle, ...styles.default };
    if (variant === 'outline') baseStyle = { ...baseStyle, ...styles.outline };
    if (variant === 'elevated') baseStyle = { ...baseStyle, ...styles.elevated };
    
    // Padding
    if (padding === 'none') baseStyle = { ...baseStyle, ...styles.paddingNone };
    if (padding === 'small') baseStyle = { ...baseStyle, ...styles.paddingSmall };
    if (padding === 'medium') baseStyle = { ...baseStyle, ...styles.paddingMedium };
    if (padding === 'large') baseStyle = { ...baseStyle, ...styles.paddingLarge };
    
    // Margin
    if (margin === 'small') baseStyle = { ...baseStyle, ...styles.marginSmall };
    if (margin === 'medium') baseStyle = { ...baseStyle, ...styles.marginMedium };
    if (margin === 'large') baseStyle = { ...baseStyle, ...styles.marginLarge };
    
    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  
  // Variantes
  default: {
    backgroundColor: colors.white,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Padding
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  
  // Margin
  marginSmall: {
    margin: 8,
  },
  marginMedium: {
    margin: 16,
  },
  marginLarge: {
    margin: 24,
  },
});

export default Card;