import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const ProductItem = ({ item }) => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <View style={styles.productItem}>
    

      <Image
        style={[styles.productImage, !imageLoading && styles.imageLoaded]}
        source={{ uri: item.image }}
        resizeMode="contain"
        onLoad={handleImageLoad}
      />

      <View style={styles.productDetails}>
      
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productCategory}>Category: {item.category}</Text>
        <Text>{'⭐'.repeat(Math.round(item.rating.rate))} ({item.rating.rate})</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
    resizeMode:"contain",
    marginTop:10
  },
  
  imageLoaded: {
    opacity: 1,
  },
  productDetails: {
    flex: 1,

  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop:10
  },
  productPrice: {
    color: '#888',
    fontSize: 14,
  },
  productDescription: {
    fontSize: 12,
    color: '#555',
    marginTop: 8,
    textAlign:"justify",
    paddingRight:10
  },
  productCategory: {
    fontSize: 12,
    marginTop: 8,
    color: '#888',
  },
});

export default ProductItem;