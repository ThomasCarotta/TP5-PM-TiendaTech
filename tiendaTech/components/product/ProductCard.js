// components/product/ProductCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import Card from '../common/Card';

const ProductCard = ({ product, onPress, onToggleFavorite, isFavorite }) => {
  // Validaciones para Strapi v4 - los atributos vienen directos
  if (!product) {
    console.warn('Producto inválido:', product);
    return (
      <Card variant="elevated" padding="small" style={styles.card}>
        <Text style={styles.errorText}>Producto no disponible</Text>
      </Card>
    );
  }

  // En Strapi v4, los atributos vienen directamente en el objeto
  const name = product.name || 'Nombre no disponible';
  const price = product.price || 0;
  const discount = product.discount || 0;
  const stock = product.stock || 0;
  const description = product.description || '';

  // Calcular precio con descuento
  const finalPrice = discount > 0 
    ? price * (1 - discount / 100)
    : price;

  // Obtener primera imagen
  const imageUrl = product.images?.[0]?.url;
  const fullImageUrl = imageUrl 
    ? `http://10.0.2.2:1337${imageUrl}`
    : null;

  // Obtener marca (con validación)
  const brandName = product.brand?.name || 'Marca no disponible';

  // Manejar favoritos
  const handleFavoritePress = () => {
    if (onToggleFavorite) {
      onToggleFavorite(product);
    }
  };

  // Verificar si es favorito
  const productIsFavorite = isFavorite ? isFavorite(product.id) : false;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card variant="elevated" padding="small" style={styles.card}>
        {/* Botón de favorito */}
        {onToggleFavorite && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[
              styles.favoriteIcon,
              productIsFavorite && styles.favoriteActive
            ]}>
              {productIsFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Imagen del producto */}
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
          
          {/* Badge de descuento en imagen */}
          {discount > 0 && (
            <View style={styles.discountImageBadge}>
              <Text style={styles.discountImageText}>-{discount}%</Text>
            </View>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          
          <Text style={styles.brand} numberOfLines={1}>
            {brandName}
          </Text>

          {/* Precios */}
          <View style={styles.priceContainer}>
            {discount > 0 && (
              <Text style={styles.originalPrice}>
                ${price.toFixed(2)}
              </Text>
            )}
            <Text style={styles.finalPrice}>
              ${finalPrice.toFixed(2)}
            </Text>
            {discount > 0 && (
              <Text style={styles.discountBadge}>
                -{discount}%
              </Text>
            )}
          </View>

          {/* Stock y estado */}
          <View style={styles.footerContainer}>
            <Text style={[
              styles.stock,
              stock === 0 && styles.outOfStock
            ]}>
              {stock > 0 ? `${stock} en stock` : 'Sin stock'}
            </Text>
            
            {/* Badge de estado */}
            <View style={[
              styles.statusBadge,
              stock > 10 && styles.statusInStock,
              stock > 0 && stock <= 10 && styles.statusLowStock,
              stock === 0 && styles.statusOutOfStock
            ]}>
              <Text style={styles.statusText}>
                {stock > 10 ? 'Disponible' : stock > 0 ? 'Últimas unidades' : 'Agotado'}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    flexDirection: 'row',
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  favoriteActive: {
    // El color ya viene del emoji
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
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
  discountImageBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountImageText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  brand: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  discountBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.success,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stock: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  outOfStock: {
    color: colors.danger,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusInStock: {
    backgroundColor: '#E8F5E8',
  },
  statusLowStock: {
    backgroundColor: '#FFF3CD',
  },
  statusOutOfStock: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusInStock: {
    backgroundColor: '#E8F5E8',
  },
  statusLowStock: {
    backgroundColor: '#FFF3CD',
  },
  statusOutOfStock: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusInStock: {
    backgroundColor: '#E8F5E8',
  },
  statusLowStock: {
    backgroundColor: '#FFF3CD',
  },
  statusOutOfStock: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusInStock: {
    backgroundColor: '#E8F5E8',
  },
  statusLowStock: {
    backgroundColor: '#FFF3CD',
  },
  statusOutOfStock: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    padding: 10,
    fontSize: 14,
  },
});

export default ProductCard;