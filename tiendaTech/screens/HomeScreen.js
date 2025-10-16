// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { productService } from '../services/api';
import ProductList from '../components/product/ProductList';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { colors } from '../styles/colors';
import globalStyles from '../styles/global';

const HomeScreen = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [dataVersion, setDataVersion] = useState(0); // Para forzar recargas

  // Configurar header con botones
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')}
            style={styles.headerButton}
          >
            <Text style={styles.headerIcon}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={showFavorites}
            style={styles.headerButton}
          >
            <Text style={styles.headerIcon}>❤️</Text>
            {favorites.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Botón de recarga */}
          <TouchableOpacity 
            onPress={() => loadProducts(false, true)}
            style={styles.headerButton}
          >
            <Text style={styles.headerIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, favorites]);

  // Cargar productos
  const loadProducts = async (isRefreshing = false, forceRefresh = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);
      
      console.log('🔄 Cargando productos...', forceRefresh ? '(forzado)' : '');
      
      // Forzar recarga sin cache
      const response = await productService.getProducts();
      
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
      
      // Incrementar versión para forzar re-render
      if (forceRefresh) {
        setDataVersion(prev => prev + 1);
      }
      
      console.log('✅ Productos cargados:', response.data.data.length);
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Recargar cuando la pantalla gane foco (vuelva de otra pantalla)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🎯 Pantalla en foco - recargando productos');
      loadProducts(false, true);
    });

    return unsubscribe;
  }, [navigation]);

  // Recargar cuando lleguemos de una compra
  useEffect(() => {
    if (route.params?.refresh) {
      console.log('🛒 Recargando desde compra exitosa');
      loadProducts(false, true);
      // Limpiar el parámetro
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  // Filtrar productos cuando cambie la búsqueda
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // Pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts(true, true); // Forzar recarga completa
  };

  // Navegar al detalle del producto
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  // Reintentar carga
  const handleRetry = () => {
    loadProducts(false, true);
  };

  // Manejar favoritos
  const toggleFavorite = (product) => {
    if (favorites.some(fav => fav.id === product.id)) {
      setFavorites(prev => prev.filter(fav => fav.id !== product.id));
    } else {
      setFavorites(prev => [...prev, product]);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  const showFavorites = () => {
    if (favorites.length === 0) {
      Alert.alert('Favoritos', 'No tienes productos en favoritos');
      return;
    }
    
    Alert.alert(
      'Tus Favoritos', 
      `Tienes ${favorites.length} producto${favorites.length !== 1 ? 's' : ''} en favoritos`,
      [
        { text: 'Ver Favoritos', onPress: () => setFilteredProducts(favorites) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const showAllProducts = () => {
    setFilteredProducts(products);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.screenContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={globalStyles.title}>Tienda Tech</Text>
          <Text style={styles.subtitle}>
            Encuentra los mejores productos de tecnología
          </Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos, marcas..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Filtros rápidos */}
          <View style={styles.quickFilters}>
            <Button
              title="Todos"
              variant={searchQuery === '' ? 'primary' : 'outline'}
              size="small"
              onPress={showAllProducts}
              style={styles.filterButton}
            />
            <Button
              title={`Favoritos (${favorites.length})`}
              variant="outline"
              size="small"
              onPress={showFavorites}
              style={styles.filterButton}
            />
            <Button
              title="Recargar"
              variant="outline"
              size="small"
              onPress={() => loadProducts(false, true)}
              style={styles.filterButton}
            />
          </View>
        </View>

        {/* Resultados de búsqueda */}
        {searchQuery && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para "{searchQuery}"
            </Text>
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearSearchText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contenido principal */}
        <View style={styles.content}>
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Oops! Algo salió mal</Text>
              <Text style={styles.errorDescription}>{error}</Text>
              <Button 
                title="Reintentar" 
                onPress={handleRetry}
                style={styles.retryButton}
              />
            </View>
          )}

          <ProductList
            products={filteredProducts}
            loading={loading && !refreshing}
            error={error}
            onProductPress={handleProductPress}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            key={dataVersion} // Forzar re-render cuando cambie la versión
          />
        </View>

        {/* Contador de productos */}
        {!loading && !error && (
          <View style={styles.footer}>
            <Text style={styles.productCount}>
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} mostrado{filteredProducts.length !== 1 ? 's' : ''}
              {searchQuery && ` de ${products.length}`}
              {' • '}v{dataVersion}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 12,
    padding: 8,
    position: 'relative',
  },
  headerIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  quickFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
  },
  searchResults: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  searchResultsText: {
    fontSize: 14,
    color: colors.text,
  },
  clearSearchText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
    ...globalStyles.card,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    minWidth: 120,
  },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  productCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default HomeScreen;