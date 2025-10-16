// screens/CartScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { colors } from '../styles/colors';
import globalStyles from '../styles/global';

const CartScreen = ({ navigation }) => {
  const { 
    cartItems, 
    clearCart, 
    getCartTotal, 
    getTotalItems,
    updateQuantity,
    removeFromCart,
    processPurchase
  } = useCart();

  // Manejar cambio de cantidad
  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  // Manejar eliminar producto
  const handleRemoveItem = (productId, productName) => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de que quieres eliminar ${productName} del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => removeFromCart(productId)
        },
      ]
    );
  };

  // Manejar limpiar carrito
  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    Alert.alert(
      'Limpiar carrito',
      '¿Estás seguro de que quieres eliminar todos los productos del carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: () => clearCart()
        },
      ]
    );
  };

  // Manejar checkout - ACTUALIZAR STOCK REAL
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // Verificar stock antes de procesar
    const outOfStockItems = cartItems.filter(item => item.quantity > item.stock);
    if (outOfStockItems.length > 0) {
      const productNames = outOfStockItems.map(item => item.name).join(', ');
      Alert.alert(
        'Stock insuficiente',
        `Los siguientes productos no tienen suficiente stock: ${productNames}`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirmar Compra',
      `¿Proceder con la compra por $${getCartTotal().toFixed(2)}?\n\nEsta acción actualizará el stock en el sistema.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar Compra', 
          onPress: async () => {
            try {
              // Procesar compra y ACTUALIZAR STOCK REAL en Strapi
              const result = await processPurchase();
              
              if (result.success) {
                Alert.alert(
                  '¡Compra Exitosa! 🎉',
                  `Tu compra por $${getCartTotal().toFixed(2)} ha sido procesada.\n\n✅ Stock actualizado en el sistema\n✅ Carrito limpiado\n✅ Productos actualizados`,
                  [
                    { 
                      text: 'Continuar Comprando', 
                      onPress: () => {
                        // Navegar a Home y forzar recarga
                        navigation.navigate('Home', { 
                          refresh: true, // ← Parámetro para forzar recarga
                          timestamp: Date.now() 
                        });
                      }
                    }
                  ]
                );
              }
            } catch (error) {
              console.error('❌ Error en checkout:', error);
              Alert.alert(
                'Error en la compra',
                `No se pudo procesar la compra:\n${error.message}`,
                [
                  { text: 'OK' },
                  { 
                    text: 'Reintentar', 
                    onPress: handleCheckout 
                  }
                ]
              );
            }
          }
        },
      ]
    );
  };

  // Carrito vacío
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.screenContainer}>
          <Card style={styles.emptyCart}>
            <Text style={styles.emptyCartTitle}>Carrito Vacío</Text>
            <Text style={styles.emptyCartText}>
              No hay productos en tu carrito. ¡Explora nuestra tienda y encuentra productos increíbles!
            </Text>
            <Button
              title="Seguir Comprando"
              onPress={() => navigation.navigate('Home')}
              style={styles.continueShoppingButton}
            />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.screenContainer}>
        {/* Header del carrito */}
        <View style={styles.header}>
          <Text style={globalStyles.title}>Mi Carrito</Text>
          <Text style={styles.itemCount}>
            {getTotalItems()} producto{getTotalItems() !== 1 ? 's' : ''}
          </Text>
          <Button
            title="Limpiar Carrito"
            variant="outline"
            size="small"
            onPress={handleClearCart}
            style={styles.clearCartButton}
          />
        </View>

        {/* Lista de productos */}
        <ScrollView 
          style={styles.itemsContainer}
          showsVerticalScrollIndicator={false}
        >
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </ScrollView>

        {/* Resumen y checkout */}
        <CartSummary
          total={getCartTotal()}
          itemCount={getTotalItems()}
          onCheckout={handleCheckout}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    position: 'relative',
  },
  itemCount: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  clearCartButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  emptyCart: {
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  continueShoppingButton: {
    minWidth: 200,
  },
});

export default CartScreen;