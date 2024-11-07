// api.js
import axios from 'axios';

const API_URL = 'https://fakestoreapi.com/products';

// fetch all products
export const fetchProducts = async (page = 1, limit = 10) => {
  try {
   
    const response = await axios.get(API_URL);
    const data = response.data;

   
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);

    return paginatedData;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// fetch products category wise
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/category/${category}`);
    console.log("hello",response)
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};