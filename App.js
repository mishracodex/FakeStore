import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Listing from './src/components/Listing';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Listing />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;