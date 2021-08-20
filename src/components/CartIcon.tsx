import React from "react";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigators/StackNavigator";
import { useAppSelector } from "../app/hooks";

const IconBox = styled.TouchableOpacity`
  position: relative;
  margin-right: 10px;
`;

const Badge = styled.Text`
  position: absolute;
  right: -8px;
  top: -5px;
  background-color: rgb(255, 99, 71);
  color: rgb(255, 255, 255);
  padding: 0 5px;
  border-radius: 20px;
`;

const CartIcon = () => {
  const products = useAppSelector((state) => state.cartProduct.value);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const goCartPage = () => {
    navigation.navigate("Cart");
  };
  return (
    <IconBox onPress={goCartPage}>
      {products.length > 0 && <Badge>{products.length}</Badge>}
      <AntDesign name="shoppingcart" size={25} />
    </IconBox>
  );
};

export default CartIcon;
