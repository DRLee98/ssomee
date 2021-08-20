import React, { useRef } from "react";
import styled from "styled-components/native";
import { FlatList, useWindowDimensions } from "react-native";
import { OrderType, ProductType } from "../../types";
import { colors } from "../../colors";
import { comma } from "../utils";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigators/StackNavigator";
import PickerSelect from "react-native-picker-select";
import Categories from "./Categories";
import { useState } from "react";

const ProductListContainer = styled.View`
  width: 100%;
  height: 100%;
  max-width: 500px;
`;

const Container = styled.TouchableOpacity`
  align-items: flex-start;
  position: relative;
`;

const SoldOutBox = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background-color: #67676780;
  border-radius: 10px;
`;

const SoldOutText = styled.Text`
  font-weight: bold;
  font-size: 55px;
  color: #444444cc;
  background-color: #ffffff80;
  padding: 5px 15px;
  border-radius: 10px;
`;

const ProductInfo = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5%;
  padding: 6px 20px;
  background-color: #ffffffcc;
`;

const Box = styled.View`
  flex-direction: row;
  align-items: center;
`;

const File = styled.Image`
  max-width: 500px;
  max-height: 500px;
  border-radius: 10px;
`;

const BrandName = styled.Text`
  color: ${colors.opacityText};
  font-weight: bold;
`;

const Name = styled.Text`
  //font-family: "Jua", sans-serif;
  font-weight: bold;
  font-size: 13px;
  margin: 3px 0;
`;

const Price = styled.Text`
  font-weight: bold;
  font-size: 18px;
`;

const OriginalPrice = styled.Text`
  text-decoration: line-through;
  font-weight: bold;
  font-size: 14px;
  color: ${colors.opacityText};
  margin-left: 3px;
`;

const DiscountRate = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${colors.accent};
  margin-right: 5px;
`;

const Separator = styled.View`
  width: 100%;
  height: 1px;
  margin: 10px 0;
`;

const IconBox = styled.TouchableOpacity`
  position: absolute;
  right: -50px;
  bottom: 25px;
`;

const Input = styled.TextInput`
  max-width: 200px;
  border: 1px solid ${colors.accent};
  background-color: ${colors.whiteColor};
  padding: 0px 10px;
`;

const InfoText = styled.Text`
  color: ${colors.opacityText};
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
`;

const Button = styled.TouchableOpacity`
  padding: 1px 3px;
  border: 1px solid ${colors.accent};
  background-color: ${colors.accent};
`;

const Text = styled.Text`
  text-align: center;
  font-weight: bold;
  color: ${colors.whiteColor};
`;

interface ProductListProp {
  categoryId?: number;
  products?: ProductType[];
  productCount?: number;
  moreFn?: Function;
  orderChangeFn?: Function;
}

const ProductList: React.FC<ProductListProp> = ({
  categoryId,
  products,
  productCount,
  moreFn,
  orderChangeFn,
}) => {
  const { width } = useWindowDimensions();
  const [word, setWord] = useState<string>("");
  const [search, setSearch] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<ProductType[]>([]);
  const flatList = useRef<FlatList<ProductType> | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const goProductDetail = (prefix: string, name: string) => {
    navigation.navigate("Detail", {
      prefix,
      name,
    });
  };
  const renderItem = ({ item: product }: { item: ProductType }) => {
    const discountRate = Math.ceil(
      (1 - product.ssomeePrice / product.originalPrice) * 100,
    );
    return (
      <Container onPress={() => goProductDetail(product.prefix, product.name)}>
        <File
          resizeMode="cover"
          style={{ width, height: width }}
          source={{ uri: product.mainImage }}
        />
        <ProductInfo>
          <BrandName>{product.brand.name}</BrandName>
          <Name>{product.name}</Name>
          <Box>
            {discountRate > 0 && <DiscountRate>{discountRate}%</DiscountRate>}
            <Price>{comma(product.ssomeePrice)}</Price>
            {product.ssomeePrice < product.originalPrice && (
              <OriginalPrice>{comma(product.originalPrice)}</OriginalPrice>
            )}
          </Box>
        </ProductInfo>
        {product.soldOut && (
          <SoldOutBox>
            <SoldOutText>Sold Out</SoldOutText>
          </SoldOutBox>
        )}
      </Container>
    );
  };
  const scrollTop = (animated: boolean = true) => {
    flatList?.current?.scrollToOffset({ animated, offset: 0 });
  };
  const searchProduct = () => {
    if (word === "") {
      setSearch(false);
    } else {
      setSearch(true);
    }
    const searchList = products?.filter((item) => item.name.indexOf(word) > -1);
    if (searchList && searchList?.length > 0) {
      setSearchList(searchList);
    }
  };
  return (
    <ProductListContainer>
      <Categories selectedId={categoryId} />
      <Box
        style={{
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Input
            style={{ width: width * 0.4 }}
            onChangeText={(text) => setWord(text)}
            placeholder={"검색어를 입력해 주세요"}
          />
          <Button onPress={searchProduct}>
            <Text>검색</Text>
          </Button>
        </Box>
        <PickerSelect
          placeholder={{ label: "최신순", value: OrderType.DateDesc }}
          style={{
            viewContainer: {
              borderColor: `${colors.accent}`,
              borderStyle: "solid",
              borderWidth: 1,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: `${colors.whiteColor}`,
              borderRadius: 5,
              marginLeft: 6,
            },
          }}
          onValueChange={(value) => {
            if (orderChangeFn) {
              orderChangeFn(value);
              scrollTop(false);
            }
          }}
          items={[
            { label: "높은 가격 순", value: OrderType.PriceDesc },
            { label: "낮은 가격 순", value: OrderType.PriceAsc },
          ]}
        />
      </Box>
      <Box
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <InfoText>{productCount}개의 상품이 있습니다.</InfoText>
      </Box>
      <FlatList
        ref={(ref) => {
          if (flatList) {
            flatList.current = ref;
          }
        }}
        ItemSeparatorComponent={() => <Separator />}
        style={{
          width: "100%",
          marginTop: 20,
        }}
        onEndReachedThreshold={0.4}
        onEndReached={() => moreFn && moreFn()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        data={search ? searchList : products}
        keyExtractor={(product) => product.prefix}
      />
      <IconBox onPress={() => scrollTop()}>
        <AntDesign
          name={"upcircleo"}
          size={30}
          style={{ color: colors.accent }}
        />
      </IconBox>
    </ProductListContainer>
  );
};

export default ProductList;
