import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ssomeeApi from "../api";
import { OrderType, ProductsListType } from "../../types";
import ScreenLayout from "../components/ScreenLayout";
import DismissKeyboard from "../components/DismissKeyboard";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigators/StackNavigator";
import ProductList from "../components/ProductList";

const Box = styled.View``;

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Category">;
  route: RouteProp<RootStackParamList, "Category">;
}

function Category({ navigation, route }: Props) {
  const [page, setPage] = useState<number>(2);
  const [order, setOrder] = useState<OrderType>(OrderType.DateDesc);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductsListType>();
  useEffect(() => {
    if (route?.params?.id && route?.params?.name) {
      navigation.setOptions({
        title: route.params.name,
      });
      setLoading(true);
      ssomeeApi
        .getCategoryProducts({
          categoryId: route.params.id + "",
          order,
        })
        .then(({ data }) => {
          setLoading(false);
          setProducts(data);
        });
    }
  }, [navigation, route]);
  const loadMore = () => {
    if (products && products.maxPage > page) {
      setPage((prev) => prev + 1);
      ssomeeApi
        .getCategoryProducts({
          categoryId: route?.params?.id + "",
          order,
          page,
        })
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
      .getCategoryProducts({ categoryId: route?.params?.id + "", order })
      .then(({ data }: { data: ProductsListType }) => {
        setProducts(data);
      });
  };
  return (
    <ScreenLayout loading={loading}>
      <DismissKeyboard>
        <ProductList
          categoryId={route?.params?.id}
          products={products?.products}
          productCount={products?.productCount}
          moreFn={loadMore}
          orderChangeFn={changeOrder}
        />
      </DismissKeyboard>
    </ScreenLayout>
  );
}

export default Category;
