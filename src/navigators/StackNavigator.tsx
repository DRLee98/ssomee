import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import { BuyProductDetailType, CategoryType } from "../../types";
import Category from "../screens/Category";
import Detail from "../screens/Detail";
import Buy from "../screens/Buy";
import Cart from "../screens/Cart";
import CartIcon from "../components/CartIcon";

export type RootStackParamList = {
  Home: undefined;
  Category: CategoryType | undefined;
  Detail: { prefix: string; name: string } | undefined;
  Buy: { products: BuyProductDetailType[] } | undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: CartIcon,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="Buy" component={Buy} />
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
