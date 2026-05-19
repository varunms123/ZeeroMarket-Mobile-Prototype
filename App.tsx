import 'react-native-gesture-handler';
import { 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  ImageBackground, 
  Animated 
} from "react-native";
import AppNavigator from "./src/navigations/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { useEffect, useState, useRef } from 'react';
import { initializeAuth } from './src/store/slices/authSlice';

function RootApContent(){
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    store.dispatch(initializeAuth() as any);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return (
      <ImageBackground 
        source={require('./src/assets/zeeroMarket.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay}>
          
          <Animated.View style={[
            styles.animatedContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            <Text style={styles.logoText}>ZEEROMARKET</Text>
            <View style={styles.accentLine} />
            <Text style={styles.subtitleText}>B2B Global Trade Platform</Text>
          </Animated.View>

          <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
          
        </View>
      </ImageBackground>
    );
  }

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
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 15, 39, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  accentLine: {
    width: 60,
    height: 3,
    backgroundColor: '#3B82F6',
    marginVertical: 12,
    borderRadius: 2,
  },
  subtitleText: {
    fontSize: 14,
    color: '#93C5FD',
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  loader: {
    position: 'absolute',
    bottom: 70,
  },
})