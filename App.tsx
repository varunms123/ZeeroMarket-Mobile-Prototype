import 'react-native-gesture-handler';
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import AppNavigator from "./src/navigations/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { useEffect } from 'react';
import { initializeAuth } from './src/store/slices/authSlice';

function RootApContent(){
  useEffect(() => {
    store.dispatch(initializeAuth() as any);
  }, []);

  return <AppNavigator/>
}

export default function App(){
  return(
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' backgroundColor='#1E3A8A'/>
          <RootApContent/>
      </SafeAreaView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A'
  }
})