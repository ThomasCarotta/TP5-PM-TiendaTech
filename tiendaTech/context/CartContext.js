// context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

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
            return prevItems; // No cambia el estado
          }

          // Si ya existe, aumentar la cantidad
          const updatedItems = prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
          resolve(updatedItems);
          return updatedItems;
        } else {
          // Si no existe, agregar nuevo item
          const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount || 0,
            brand: product.brand,
            images: product.images,
            stock: product.stock, // ← Guardamos el stock disponible
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
          // Validar que no exceda el stock
          if (newQuantity > item.stock) {
            alert(`No puedes comprar más de ${item.stock} unidades de ${item.name}`);
            return item; // No cambia la cantidad
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

  // Nueva función: procesar compra y reducir stock
  const processPurchase = async () => {
    try {
      // Aquí iría la llamada a la API para actualizar stock en Strapi
      // Por ahora simulamos la actualización
      console.log('Procesando compra y reduciendo stock...');
      
      // En una app real, aquí harías:
      // await api.post('/purchase', { items: cartItems });
      
      // Limpiar carrito después de la compra
      clearCart();
      return true;
    } catch (error) {
      console.error('Error procesando compra:', error);
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
    processPurchase // ← Nueva función
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;