// components/product/ProductList.js
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';
import Card from '../common/Card';
import { colors } from '../../styles/colors';

const ProductList = ({ 
  products, 
  loading, 
  error, 
  onProductPress,
  onRefresh,
  refreshing = false,
  onToggleFavorite, 
  isFavorite         
}) => {
  // Estado de carga
  if (loading) {
    return (
      <Loading 
        text="Cargando productos..." 
        containerStyle={styles.centered}
      />
    );
  }

  // Estado de error
  if (error) {
    return (
      <Card variant="outline" padding="medium" style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar productos</Text>
        <Text style={styles.errorSubText}>{error}</Text>
      </Card>
    );
  }

  // Estado sin productos
  if (!products || products.length === 0) {
    return (
      <Card variant="outline" padding="medium" style={styles.centered}>
        <Text style={styles.emptyText}>No se encontraron productos</Text>
      </Card>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ProductCard 
          product={item} 
          onPress={() => onProductPress && onProductPress(item)}
          onToggleFavorite={onToggleFavorite} 
          isFavorite={isFavorite}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  centered: {
    margin: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProductList;