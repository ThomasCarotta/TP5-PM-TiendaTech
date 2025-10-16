// context/CartContext.js
import React, { createContext, useState, useContext } from 'react';
import { productService } from '../services/api'; // ← Importar el servicio

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    return new Promise((resolve, reject) => {
      // Validar stock disponible
      if (product.stock < quantity) {
        reject(new Error(`Solo quedan ${product.stock} unidades disponibles`));
        return;
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          // Validar que no exceda el stock al sumar
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            reject(new Error(`No puedes agregar más de ${product.stock} unidades`));
            return prevItems;
          }

          const updatedItems = prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
          resolve(updatedItems);
          return updatedItems;
        } else {
          const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount || 0,
            brand: product.brand,
            images: product.images,
            stock: product.stock,
            quantity: quantity,
            addedAt: new Date().toISOString()
          };
          const updatedItems = [...prevItems, newItem];
          resolve(updatedItems);
          return updatedItems;
        }
      });
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          if (newQuantity > item.stock) {
            alert(`No puedes comprar más de ${item.stock} unidades de ${item.name}`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount > 0
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // NUEVO: Procesar compra y ACTUALIZAR STOCK REAL en Strapi
  const processPurchase = async () => {
    try {
      // Preparar datos para enviar a Strapi
      const purchaseItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      console.log('🔄 Actualizando stock en Strapi...', purchaseItems);

      // Llamar a la API de Strapi para actualizar stock
      const response = await productService.updateStock(purchaseItems);
      
      if (response.data.success) {
        console.log('✅ Stock actualizado exitosamente:', response.data.results);
        
        // Limpiar carrito después de la compra exitosa
        clearCart();
        
        return { 
          success: true, 
          results: response.data.results,
          message: 'Compra procesada y stock actualizado'
        };
      } else {
        // Algunos productos no se pudieron actualizar
        const failedProducts = response.data.results.filter(r => !r.success);
        throw new Error(`Error al actualizar stock: ${response.data.message}. Fallaron: ${failedProducts.length} productos`);
      }
      
    } catch (error) {
      console.error('❌ Error procesando compra:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getTotalItems,
    isInCart,
    getProductQuantity,
    processPurchase
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;