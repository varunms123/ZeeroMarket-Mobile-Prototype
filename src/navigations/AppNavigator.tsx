import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";
import LoginScreen from "../screens/auth/LoginScreen";
import { useAppSelector } from "../store/store";
import AdminPanelScreen from "../screens/admin/AdminPanelScreen";
import AddProductScreen from "../screens/supplier/AddProductScreen";
import BrowseScreen from "../screens/buyer/BrowseScreen";
import SupplierDashboardScreen from "../screens/supplier/SupplierDashboardScreen";

const Stack = createStackNavigator();

export default function AppNavigator(){
    const { isAuthenticated, role } = useAppSelector((state) => state.auth);

    return(
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {backgroundColor: '#1E3A8A'},
                    headerTintColor: '#fff',
                    headerTitleStyle: {fontWeight: 'bold'}
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
                ) : role === 'admin' ? (
                    <Stack.Screen name="ZeeroMarket Admin Panel" component={AdminPanelScreen}/>
                ) : role === 'supplier' ? (
                        <>
                          <Stack.Screen name="Supplier Dashboard" component={SupplierDashboardScreen} />
                          <Stack.Screen name="Add Product Space" component={AddProductScreen} />
                        </>
                ) : (
                    <Stack.Screen name="ZeeroMarket Dashboard" component={BrowseScreen}/>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}