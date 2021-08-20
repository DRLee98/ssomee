import React from "react";
import { colors } from "../../colors";
import { useAppSelector } from "../app/hooks";
import styled from "styled-components/native";
import CartProductList from "../components/CartProductList";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
import { useState } from "react";
import { useEffect } from "react";
import { BuyProductDetailType } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigators/StackNavigator";

const Container = styled.View`
  width: 100%;
  height: 100%;
  max-width: 660px;
  padding: 20px;
  background-color: ${colors.whiteColor};
  justify-content: space-between;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 20px;
  border: 1px solid ${colors.accent};
  background-color: ${colors.accent};
`;

const Text = styled.Text`
  width: 100%;
  text-align: center;
  font-weight: bold;
  color: ${colors.whiteColor};
`;

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Cart">;
}

function Cart({ navigation }: Props) {
  const products = useAppSelector((state) => state.cartProduct.value);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<
    BuyProductDetailType[]
  >([]);
  useEffect(() => {
    navigation.setOptions({
      title: "장바구니",
    });
  }, []);
  const getCheckedItem = (products: BuyProductDetailType[]) => {
    setSelectedProducts(products);
  };
  const goBuyProduct = () => {
    navigation.navigate("Buy", {
      products: selectedProducts,
    });
  };
  return (
    <ScreenLayout loading={loading}>
      <DismissKeyboard>
        <Container>
          <CartProductList
            products={products}
            getCheckedItem={getCheckedItem}
          />
          <Button onPress={goBuyProduct}>
            <Text>구매하러 가기</Text>
          </Button>
        </Container>
      </DismissKeyboard>
    </ScreenLayout>
  );
}

export default Cart;
