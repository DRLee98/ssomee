import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components/native";
import ssomeeApi from "../api";
import { OrderType, ProductsListType } from "../../types";
import ScreenLayout from "../components/ScreenLayout";
import DismissKeyboard from "../components/DismissKeyboard";
import ProductList from "../components/ProductList";
import { RootStackParamList } from "../navigators/StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Box = styled.View`
  width: 100%;
  height: 100%;
`;

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
}

function Home({ navigation }: Props) {
  const [page, setPage] = useState<number>(2);
  const [order, setOrder] = useState<OrderType>(OrderType.DateDesc);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductsListType>();
  useEffect(() => {
    setLoading(true);
    navigation.setOptions({
      title: "소미마켓",
    });
    ssomeeApi
      .getAllProducts({ order })
      .then(({ data }: { data: ProductsListType }) => {
        setLoading(false);
        setProducts(data);
      });
  }, []);
  const loadMore = () => {
    if (products && products.maxPage > page) {
      setPage((prev) => prev + 1);
      ssomeeApi
        .getAllProducts({ order, page })
        .then(({ data }: { data: ProductsListType }) => {
          const newProduct = {
            ...products,
            products: [...products.products, ...data.products],
          };
          setProducts(newProduct);
        });
    }
  };
  const changeOrder = (order: OrderType) => {
    setOrder(order);
    setPage(2);
    ssomeeApi
      .getAllProducts({ order })
      .then(({ data }: { data: ProductsListType }) => {
        setProducts(data);
      });
  };
  return (
    <ScreenLayout loading={loading}>
      <DismissKeyboard>
        <ProductList
          products={products?.products}
          productCount={products?.productCount}
          moreFn={loadMore}
          orderChangeFn={changeOrder}
        />
      </DismissKeyboard>
    </ScreenLayout>
  );
}

export default Home;
