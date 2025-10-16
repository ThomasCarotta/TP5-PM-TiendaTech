// // screens/ProductDetailScreen.js (TEMPORAL - SIN CART CONTEXT)
// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   Image, 
//   StyleSheet, 
//   SafeAreaView,
//   Alert 
// } from 'react-native';
// import Button from '../components/common/Button';
// import Card from '../components/common/Card';
// import { colors } from '../styles/colors';
// import globalStyles from '../styles/global';

// const ProductDetailScreen = ({ route, navigation }) => {
//   const { product } = route.params;
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [addingToCart, setAddingToCart] = useState(false);

//   if (!product) {
//     return (
//       <SafeAreaView style={globalStyles.container}>
//         <View style={globalStyles.centered}>
//           <Text>Producto no encontrado</Text>
//           <Button 
//             title="Volver" 
//             onPress={() => navigation.goBack()}
//             style={{ marginTop: 16 }}
//           />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Datos del producto
//   const name = product.name || 'Nombre no disponible';
//   const price = product.price || 0;
//   const discount = product.discount || 0;
//   const stock = product.stock || 0;
//   const description = product.description || '';
//   const brandName = product.brand?.name || 'Marca no disponible';
//   const specifications = product.specifications;

//   // Calcular precio final
//   const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

//   // Imágenes
//   const images = product.images || [];
//   const mainImageUrl = images[selectedImageIndex]?.url 
//     ? `http://10.0.2.2:1337${images[selectedImageIndex].url}`
//     : null;

//   // Handlers temporales
//   const handleAddToCart = async () => {
//     setAddingToCart(true);
//     setTimeout(() => {
//       Alert.alert(
//         '¡Producto agregado! (Demo)',
//         `${name} se agregó al carrito`,
//         [{ text: 'OK' }]
//       );
//       setAddingToCart(false);
//     }, 1000);
//   };

//   const handleBuyNow = async () => {
//     setAddingToCart(true);
//     setTimeout(() => {
//       Alert.alert(
//         'Checkout Simulado (Demo)',
//         `Total: $${finalPrice.toFixed(2)}\n\nFuncionalidad en desarrollo`,
//         [{ text: 'OK' }]
//       );
//       setAddingToCart(false);
//     }, 1000);
//   };

//   return (
//     <SafeAreaView style={globalStyles.container}>
//       <ScrollView style={styles.container}>
//         {/* Galería de imágenes */}
//         <Card padding="none" style={styles.imageSection}>
//           {mainImageUrl ? (
//             <Image source={{ uri: mainImageUrl }} style={styles.mainImage} resizeMode="contain" />
//           ) : (
//             <View style={styles.placeholderImage}>
//               <Text style={styles.placeholderText}>Imagen no disponible</Text>
//             </View>
//           )}
          
//           {/* Miniaturas */}
//           {images.length > 1 && (
//             <ScrollView horizontal style={styles.thumbnailsContainer}>
//               {images.map((image, index) => (
//                 <Button
//                   key={image.id}
//                   variant={selectedImageIndex === index ? 'primary' : 'outline'}
//                   size="small"
//                   onPress={() => setSelectedImageIndex(index)}
//                   style={styles.thumbnailButton}
//                 >
//                   <Image 
//                     source={{ uri: `http://10.0.2.2:1337${image.url}` }}
//                     style={styles.thumbnail}
//                     resizeMode="cover"
//                   />
//                 </Button>
//               ))}
//             </ScrollView>
//           )}
//         </Card>

//         {/* Información del producto */}
//         <Card style={styles.infoSection}>
//           <Text style={styles.productName}>{name}</Text>
//           <Text style={styles.brand}>{brandName}</Text>
          
//           {/* Precios */}
//           <View style={styles.priceContainer}>
//             {discount > 0 && (
//               <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
//             )}
//             <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
//             {discount > 0 && (
//               <Text style={styles.discountBadge}>-{discount}% OFF</Text>
//             )}
//           </View>

//           {/* Stock */}
//           <View style={styles.stockContainer}>
//             <Text style={[styles.stock, stock === 0 && styles.outOfStock]}>
//               {stock > 0 ? `${stock} unidades disponibles` : 'Sin stock'}
//             </Text>
//           </View>
//         </Card>

//         {/* Descripción */}
//         {description && (
//           <Card style={styles.descriptionSection}>
//             <Text style={styles.sectionTitle}>Descripción</Text>
//             <Text style={styles.description}>{description}</Text>
//           </Card>
//         )}

//         {/* Especificaciones */}
//         {specifications && (
//           <Card style={styles.specsSection}>
//             <Text style={styles.sectionTitle}>Especificaciones</Text>
//             <Text style={styles.specifications}>
//               {JSON.stringify(specifications, null, 2)}
//             </Text>
//           </Card>
//         )}
//       </ScrollView>

//       {/* Botones de acción */}
//       {stock > 0 && (
//         <Card style={styles.actionButtons}>
//           <Button
//             title="Agregar al Carrito"
//             onPress={handleAddToCart}
//             loading={addingToCart}
//             disabled={addingToCart}
//             fullWidth
//             style={styles.cartButton}
//           />
//           <Button
//             title="Comprar Ahora"
//             onPress={handleBuyNow}
//             loading={addingToCart}
//             disabled={addingToCart}
//             variant="secondary"
//             fullWidth
//             style={styles.buyButton}
//           />
//         </Card>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   imageSection: {
//     marginBottom: 16,
//   },
//   mainImage: {
//     width: '100%',
//     height: 300,
//     backgroundColor: colors.background,
//   },
//   placeholderImage: {
//     width: '100%',
//     height: 200,
//     backgroundColor: colors.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     color: colors.textSecondary,
//     fontSize: 16,
//   },
//   thumbnailsContainer: {
//     padding: 12,
//     flexDirection: 'row',
//   },
//   thumbnailButton: {
//     marginRight: 8,
//     padding: 2,
//   },
//   thumbnail: {
//     width: 50,
//     height: 50,
//     borderRadius: 6,
//   },
//   infoSection: {
//     marginBottom: 16,
//   },
//   productName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 4,
//   },
//   brand: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginBottom: 12,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   originalPrice: {
//     fontSize: 18,
//     color: colors.textSecondary,
//     textDecorationLine: 'line-through',
//     marginRight: 12,
//   },
//   finalPrice: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: colors.primary,
//     marginRight: 12,
//   },
//   discountBadge: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: colors.success,
//     backgroundColor: '#E8F5E8',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   stockContainer: {
//     marginTop: 8,
//   },
//   stock: {
//     fontSize: 14,
//     color: colors.success,
//     fontWeight: '500',
//   },
//   outOfStock: {
//     color: colors.danger,
//   },
//   descriptionSection: {
//     marginBottom: 16,
//   },
//   specsSection: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 12,
//   },
//   description: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: colors.text,
//   },
//   specifications: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: colors.text,
//     fontFamily: 'monospace',
//   },
//   actionButtons: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   cartButton: {
//     marginBottom: 12,
//   },
//   buyButton: {
//     marginBottom: 0,
//   },
// });

// export default ProductDetailScreen;

// screens/ProductDetailScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  Alert 
} from 'react-native';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { colors } from '../styles/colors';
import globalStyles from '../styles/global';

// Importamos el hook corregido
import { useCart } from '../context/CartContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart(); // ← Ahora usa el hook corregido
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.centered}>
          <Text>Producto no encontrado</Text>
          <Button 
            title="Volver" 
            onPress={() => navigation.goBack()}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Datos del producto
  const name = product.name || 'Nombre no disponible';
  const price = product.price || 0;
  const discount = product.discount || 0;
  const stock = product.stock || 0;
  const description = product.description || '';
  const brandName = product.brand?.name || 'Marca no disponible';
  const specifications = product.specifications;

  // Calcular precio final
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

  // Imágenes
  const images = product.images || [];
  const mainImageUrl = images[selectedImageIndex]?.url 
    ? `http://10.0.2.2:1337${images[selectedImageIndex].url}`
    : null;

  // Agregar al carrito - AHORA FUNCIONAL
  const handleAddToCart = async () => {
    if (stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible en este momento.');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product);
      Alert.alert(
        '¡Producto agregado!',
        `${name} se agregó al carrito`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  // Comprar ahora - AHORA FUNCIONAL
  const handleBuyNow = async () => {
    if (stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible en este momento.');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product);
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={styles.container}>
        {/* Galería de imágenes */}
        <Card padding="none" style={styles.imageSection}>
          {mainImageUrl ? (
            <Image source={{ uri: mainImageUrl }} style={styles.mainImage} resizeMode="contain" />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Imagen no disponible</Text>
            </View>
          )}
          
          {/* Miniaturas */}
          {images.length > 1 && (
            <ScrollView horizontal style={styles.thumbnailsContainer}>
              {images.map((image, index) => (
                <Button
                  key={image.id}
                  variant={selectedImageIndex === index ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => setSelectedImageIndex(index)}
                  style={styles.thumbnailButton}
                >
                  <Image 
                    source={{ uri: `http://10.0.2.2:1337${image.url}` }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                </Button>
              ))}
            </ScrollView>
          )}
        </Card>

        {/* Información del producto */}
        <Card style={styles.infoSection}>
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.brand}>{brandName}</Text>
          
          {/* Precios */}
          <View style={styles.priceContainer}>
            {discount > 0 && (
              <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
            )}
            <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
            {discount > 0 && (
              <Text style={styles.discountBadge}>-{discount}% OFF</Text>
            )}
          </View>

          {/* Stock */}
          <View style={styles.stockContainer}>
            <Text style={[styles.stock, stock === 0 && styles.outOfStock]}>
              {stock > 0 ? `${stock} unidades disponibles` : 'Sin stock'}
            </Text>
          </View>
        </Card>

        {/* Descripción */}
        {description && (
          <Card style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{description}</Text>
          </Card>
        )}

        {/* Especificaciones */}
        {specifications && (
          <Card style={styles.specsSection}>
            <Text style={styles.sectionTitle}>Especificaciones</Text>
            <Text style={styles.specifications}>
              {JSON.stringify(specifications, null, 2)}
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Botones de acción */}
      {stock > 0 && (
        <Card style={styles.actionButtons}>
          <Button
            title="Agregar al Carrito"
            onPress={handleAddToCart}
            loading={addingToCart}
            disabled={addingToCart}
            fullWidth
            style={styles.cartButton}
          />
          <Button
            title="Comprar Ahora"
            onPress={handleBuyNow}
            loading={addingToCart}
            disabled={addingToCart}
            variant="secondary"
            fullWidth
            style={styles.buyButton}
          />
        </Card>
      )}
    </SafeAreaView>
  );
};

// Los styles se mantienen igual...
const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: { marginBottom: 16 },
  mainImage: { width: '100%', height: 300, backgroundColor: colors.background },
  placeholderImage: { width: '100%', height: 200, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: colors.textSecondary, fontSize: 16 },
  thumbnailsContainer: { padding: 12, flexDirection: 'row' },
  thumbnailButton: { marginRight: 8, padding: 2 },
  thumbnail: { width: 50, height: 50, borderRadius: 6 },
  infoSection: { marginBottom: 16 },
  productName: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  brand: { fontSize: 16, color: colors.textSecondary, marginBottom: 12 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  originalPrice: { fontSize: 18, color: colors.textSecondary, textDecorationLine: 'line-through', marginRight: 12 },
  finalPrice: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginRight: 12 },
  discountBadge: { fontSize: 14, fontWeight: 'bold', color: colors.success, backgroundColor: '#E8F5E8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  stockContainer: { marginTop: 8 },
  stock: { fontSize: 14, color: colors.success, fontWeight: '500' },
  outOfStock: { color: colors.danger },
  descriptionSection: { marginBottom: 16 },
  specsSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: colors.text },
  specifications: { fontSize: 14, lineHeight: 20, color: colors.text, fontFamily: 'monospace' },
  actionButtons: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  cartButton: { marginBottom: 12 },
  buyButton: { marginBottom: 0 },
});

export default ProductDetailScreen;