// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './context/CartContext';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'Tienda Tech',
            }}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen}
            options={{
              title: 'Detalle del Producto',
            }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{
              title: 'Carrito de Compras',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}