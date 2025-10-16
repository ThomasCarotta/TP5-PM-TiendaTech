// components/cart/CartItem.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';
import { colors } from '../../styles/colors';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  // Validar que el item exista
  if (!item) {
    return (
      <Card style={styles.container}>
        <Text style={styles.errorText}>Producto no disponible</Text>
      </Card>
    );
  }

  // Usar valores por defecto para evitar errores
  const name = item.name || 'Producto no disponible';
  const price = item.price || 0;
  const discount = item.discount || 0;
  const quantity = item.quantity || 1;

  // Calcular precio final con validación
  const finalPrice = discount > 0 
    ? price * (1 - discount / 100)
    : price;

  // Obtener imagen con validación
  const imageUrl = item.images?.[0]?.url;
  const fullImageUrl = imageUrl 
    ? `http://10.0.2.2:1337${imageUrl}`
    : null;

  // Calcular subtotal
  const subtotal = finalPrice * quantity;

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        {/* Imagen */}
        <View style={styles.imageContainer}>
          {fullImageUrl ? (
            <Image 
              source={{ uri: fullImageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}
        </View>

        {/* Información */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          
          {/* Precio unitario */}
          <Text style={styles.unitPrice}>
            ${finalPrice.toFixed(2)} c/u
          </Text>

          {/* Controles de cantidad */}
          <View style={styles.quantityControls}>
            <Button
              title="-"
              variant="outline"
              size="small"
              onPress={() => onQuantityChange(item.id, quantity - 1)}
              style={styles.quantityButton}
              disabled={quantity <= 1}
            />
            
            <Text style={styles.quantity}>
              {quantity}
            </Text>
            
            <Button
              title="+"
              variant="outline"
              size="small"
              onPress={() => onQuantityChange(item.id, quantity + 1)}
              style={styles.quantityButton}
            />
          </View>
        </View>

        {/* Subtotal y eliminar */}
        <View style={styles.actions}>
          <Text style={styles.subtotal}>
            ${subtotal.toFixed(2)}
          </Text>
          
          <Button
            title="Eliminar"
            variant="danger"
            size="small"
            onPress={() => onRemove(item.id, name)}
            style={styles.removeButton}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    padding: 0,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  removeButton: {
    paddingHorizontal: 8,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    padding: 10,
  },
});

export default CartItem;