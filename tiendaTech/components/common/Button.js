// components/common/Button.js
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { colors } from '../../styles/colors';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  size = 'medium', // 'small' | 'medium' | 'large'
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyle = () => {
    let baseStyle = styles.button;
    
    // Variantes
    if (variant === 'primary') baseStyle = { ...baseStyle, ...styles.primary };
    if (variant === 'secondary') baseStyle = { ...baseStyle, ...styles.secondary };
    if (variant === 'outline') baseStyle = { ...baseStyle, ...styles.outline };
    if (variant === 'danger') baseStyle = { ...baseStyle, ...styles.danger };
    
    // Tamaños
    if (size === 'small') baseStyle = { ...baseStyle, ...styles.small };
    if (size === 'large') baseStyle = { ...baseStyle, ...styles.large };
    
    // Estados
    if (disabled) baseStyle = { ...baseStyle, ...styles.disabled };
    if (fullWidth) baseStyle = { ...baseStyle, ...styles.fullWidth };
    
    return baseStyle;
  };

  const getTextStyle = () => {
    let baseStyle = styles.text;
    
    // Variantes de texto
    if (variant === 'primary') baseStyle = { ...baseStyle, ...styles.primaryText };
    if (variant === 'secondary') baseStyle = { ...baseStyle, ...styles.secondaryText };
    if (variant === 'outline') baseStyle = { ...baseStyle, ...styles.outlineText };
    if (variant === 'danger') baseStyle = { ...baseStyle, ...styles.dangerText };
    
    // Tamaños de texto
    if (size === 'small') baseStyle = { ...baseStyle, ...styles.smallText };
    if (size === 'large') baseStyle = { ...baseStyle, ...styles.largeText };
    
    // Estados
    if (disabled) baseStyle = { ...baseStyle, ...styles.disabledText };
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={
            variant === 'outline' ? colors.primary : colors.white
          } 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variantes
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  
  // Tamaños
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  
  // Estados
  disabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Texto
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.white,
  },
  
  // Tamaños de texto
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Texto deshabilitado
  disabledText: {
    color: colors.textSecondary,
  },
});

export default Button;