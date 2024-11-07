import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchProducts, fetchProductsByCategory } from './api';
import ProductItem from './ProductItem';

const Listing = () => {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]);  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const categories = ['All', 'electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing'];

  useEffect(() => {
    fetchInitialProducts();
  }, []);

  // Fetch initial products for the "All" category
  const fetchInitialProducts = async () => {
    setLoading(true);
    const initialProducts = await fetchProducts(page);
    // Sort products only for "All" category
    const sortedProducts = initialProducts?.sort((a, b) => a.price - b.price);
    setProducts(sortedProducts);
    setFilteredProducts(sortedProducts);
    setLoading(false);
  };

  // Load more products with pagination
  const loadMoreProducts = async () => {
    if (!loading && !isSearching && hasMoreData) {
      setLoading(true);
      const nextPage = page + 1;
      const moreProducts = await fetchProducts(nextPage);

      if (moreProducts.length > 0) {
        const sortedMoreProducts = moreProducts.sort((a, b) => a.price - b.price);
        setProducts((prev) => [...prev, ...sortedMoreProducts]);
        setFilteredProducts((prev) => [...prev, ...sortedMoreProducts]);
        setPage(nextPage);
      } else {
        setHasMoreData(false); 
      }
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      setIsSearching(true);
      const filtered = products.filter(
        item =>
          item.title.toLowerCase().includes(text.toLowerCase()) ||
          item.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setIsSearching(false);
      setFilteredProducts(products);
    }
  };

  // Handle category change, fetch products by category or all products
  const handleCategoryChange = async (selectedCategory) => {
    setCategory(selectedCategory);
    setIsSearching(false);
    setPage(1);
    setLoading(true);
    setHasMoreData(true);

    if (selectedCategory === 'All') {
      fetchInitialProducts();
    } else {
      const categoryProducts = await fetchProductsByCategory(selectedCategory);
      if (categoryProducts && categoryProducts.length > 0) {
        categoryProducts.sort((a,b)=>a.price-b.price)
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    }
    setLoading(false);
  };

  // Render category items
  const renderCategoryItem = ({ item }) => (
    <Text
      style={[styles.categoryItem, item === category && styles.activeCategory]}
      onPress={() => handleCategoryChange(item)}
    >
      {item}
    </Text>
  );

  // Footer component for loading more or displaying no more data
  const renderFooter = () => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (!hasMoreData) return <Text style={styles.noMoreDataText}>No more data</Text>;
    return null;
  };

  // Empty component when no results are found in search
  const renderEmptyComponent = () => {
    if (isSearching && filteredProducts.length === 0) {
      return <Text style={styles.noResultsText}>No search results found</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={{marginBottom:5, fontWeight:"800"}}>Search Products</Text>
      {/* Use this Textinput we search the product title and description wise */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title or description"
        value={searchText}
        onChangeText={handleSearch}
      />
      <View>
{/* This flatlist is using for showing categorys */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        horizontal
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
        />
        </View>
{/* This flatlist is use for show the product list */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={category === 'All' && !isSearching ? loadMoreProducts : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryItem: {
    padding: 8,
    marginHorizontal: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  activeCategory: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  noMoreDataText: {
    textAlign: 'center',
    padding: 16,
    color: '#888',
  },
  noResultsText: {
    textAlign: 'center',
    padding: 16,
    color: '#888',
  },
});

export default Listing;
