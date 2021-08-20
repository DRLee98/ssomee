import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { colors } from "../../colors";
import {
  CategoryType,
  ProductDetailType,
  SelectedOptionType,
} from "../../types";
import ssomeeApi from "../api";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
import { Slider } from "../components/Slider";
import { RootStackParamList } from "../navigators/StackNavigator";
import HTML from "react-native-render-html";
import PickerSelect from "react-native-picker-select";
import { comma } from "../utils";
import { useAppDispatch } from "../app/hooks";
import { add } from "../app/store";
import { Alert, ScrollView, useWindowDimensions } from "react-native";
import { Platform } from "react-native";

const Container = styled.ScrollView`
  width: 100%;
  height: 100%;
  max-width: 660px;
  padding: 20px;
  background-color: ${colors.whiteColor};
`;

const BigImage = styled.Image`
  max-width: 600px;
  max-height: 600px;
  border-radius: 10px;
`;

const ImageList = styled.View`
  margin: 10px 0;
`;

const ImageItem = styled.TouchableOpacity``;

const SmallImage = styled.Image`
  max-width: 100px;
  max-height: 100px;
  border-radius: 6px;
`;

const ProductInfo = styled.View``;

const Box = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BrandName = styled.Text`
  font-size: 18px;
  color: ${colors.opacityText};
  font-weight: bold;
`;

const Name = styled.Text`
  //font-family: "Jua", sans-serif;
  font-weight: bold;
  font-size: 16px;
  margin: 3px 0;
`;

const Price = styled.Text`
  font-weight: bold;
  font-size: 20px;
`;

const OriginalPrice = styled.Text`
  text-decoration: line-through;
  font-weight: bold;
  font-size: 16px;
  color: ${colors.opacityText};
  margin-left: 3px;
`;

const DiscountRate = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: ${colors.accent};
  margin-right: 5px;
`;

const InfoText = styled.Text`
  color: ${colors.opacityText};
  font-size: 12px;
  font-weight: 100;
`;

const CategoryBox = styled.TouchableOpacity`
  font-size: 13px;
  min-width: 50px;
  padding: 3px 5px;
  border-radius: 15px;
  border: 1px solid ${colors.accent};
  font-weight: bold;
  margin-left: 10px;
`;

const CategoryName = styled.Text``;

const Description = styled.View`
  width: 100%;
  height: 100%;
`;

const Button = styled.TouchableOpacity`
  font-weight: bold;
  padding: 10px 20px;
`;

const BuyButton = styled(Button)`
  border: 1px solid ${colors.accent};
  background-color: ${colors.accent};
`;

const CartButton = styled(Button)`
  border: 1px solid ${colors.accent};
  background-color: ${colors.whiteColor};
`;

const Text = styled.Text``;

const Input = styled.TextInput`
  width: 100%;
  max-width: 250px;
  border: 1px solid ${colors.accent};
  background-color: ${colors.whiteColor};
  padding: 0px 10px;
`;

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Detail">;
  route: RouteProp<RootStackParamList, "Detail">;
}

function Detail({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<ProductDetailType>();
  const [imageList, setImageList] = useState<string[]>([]);
  const [imageSrc, setImageSrc] = useState<string>();
  const [optionText, setOptionText] = useState<string>();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType[]>(
    [],
  );
  useEffect(() => {
    if (route?.params?.prefix && route?.params?.name) {
      navigation.setOptions({
        title: route.params.name,
      });
      setLoading(true);
      ssomeeApi
        .getProductDetail({
          prefix: route.params.prefix,
        })
        .then(({ data }: { data: ProductDetailType }) => {
          setLoading(false);
          setProductDetail(data);
          setImageSrc(data.mainImage);
          const detailImageList = data.detailImages.map((item) => item.image);
          setImageList([data.mainImage, ...detailImageList]);
          const selectOptions = data.options.filter(
            (option) => option.type === "select",
          );
          if (selectOptions.length > 0) {
            selectOptions.map((item) => {
              const option: SelectedOptionType = {
                optionName: item.optionCategoryName,
                optionValue: {
                  name: item.options[0].name,
                  price: item.options[0].price,
                },
              };
              setSelectedOptions((prev) => [...prev, option]);
            });
          }
        });
    }
  }, []);
  const goToCategory = ({ id, name }: CategoryType) => {
    navigation.navigate("Category", {
      id,
      name,
    });
  };
  const discountRate = productDetail
    ? Math.ceil(
        (1 - productDetail?.ssomeePrice / productDetail?.originalPrice) * 100,
      )
    : 0;
  const ViewImage = (src: string) => setImageSrc(src);
  const goProductBuy = () => {
    if (optionText) {
      setSelectedOptions((prev) => [...prev, { optionName: optionText }]);
    }
    if (productDetail) {
      navigation.navigate("Buy", {
        products: [
          {
            ...productDetail,
            selectedOptions,
          },
        ],
      });
    }
  };

  const addCart = () => {
    if (productDetail) {
      const newProduct = {
        ...productDetail,
        selectedOptions,
      };
      dispatch(add(newProduct));

      if (Platform.OS === "windows") {
        const ok = window.confirm(
          `${newProduct.name} 상품이 장바구니에 추가되었습니다. \n 장바구니로 이동하시겠습니까?`,
        );
        if (ok) {
          navigation.navigate("Cart");
        }
      } else {
        Alert.alert(
          `${newProduct.name} 상품이 장바구니에 추가되었습니다.`,
          "장바구니로 이동하시겠습니까?",
          [
            { text: "네", onPress: () => navigation.navigate("Cart") },
            { text: "아니요" },
          ],
        );
      }
    }
  };
  return (
    <ScreenLayout loading={loading}>
      <DismissKeyboard>
        {productDetail ? (
          <Container>
            <BigImage
              resizeMode="cover"
              style={{ width: "100%", height: width }}
              source={{ uri: imageSrc }}
            />
            {imageList.length > 0 && (
              <ImageList>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  contentContainerStyle={{ flexDirection: "row" }}
                >
                  {imageList.map((image) => (
                    <ImageItem key={image} onPress={() => ViewImage(image)}>
                      <SmallImage
                        resizeMode="cover"
                        style={{ width: width / 10, height: width / 10 }}
                        source={{ uri: image }}
                      />
                    </ImageItem>
                  ))}
                </ScrollView>
              </ImageList>
            )}
            <ProductInfo>
              <Box>
                <BrandName>{productDetail?.brand.name}</BrandName>
                <CategoryBox
                  onPress={() =>
                    goToCategory({
                      id: productDetail?.category.id,
                      name: productDetail?.category.name,
                    })
                  }
                >
                  <CategoryName>{productDetail?.category.name}</CategoryName>
                </CategoryBox>
              </Box>
              <Name>{productDetail?.name}</Name>
              <Box>
                {discountRate > 0 && (
                  <DiscountRate>{discountRate}%</DiscountRate>
                )}
                <Price>{comma(productDetail.ssomeePrice)}</Price>
                {productDetail?.ssomeePrice < productDetail?.originalPrice && (
                  <OriginalPrice>
                    {comma(productDetail?.originalPrice)}
                  </OriginalPrice>
                )}
                {productDetail?.currentOrderLimit && (
                  <InfoText>
                    1인당 주문 가능 수량 : {productDetail?.currentOrderLimit}개
                  </InfoText>
                )}
              </Box>
              {productDetail.options.length > 0 && (
                <Box>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle={{ flexDirection: "row" }}
                  >
                    {productDetail.options.map((optionObj) => {
                      if (optionObj.type === "select") {
                        return (
                          <Box key={`option${optionObj.id}`}>
                            <Text>{optionObj.optionCategoryName}</Text>
                            {optionObj.options && (
                              <PickerSelect
                                placeholder={{
                                  label:
                                    optionObj.options[0].price > 0
                                      ? `${optionObj.options[0].name} +${comma(
                                          optionObj.options[0].price,
                                        )}`
                                      : optionObj.options[0].name,
                                  value: JSON.stringify({
                                    name: optionObj.options[0].name,
                                    price: optionObj.options[0].price,
                                  }),
                                }}
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
                                onValueChange={(value) =>
                                  setSelectedOptions((prev) => {
                                    let list = prev;
                                    const parseValue = JSON.parse(value);
                                    const option: SelectedOptionType = {
                                      optionName: optionObj.optionCategoryName,
                                      optionValue: {
                                        name: parseValue.name,
                                        price: parseValue.price,
                                      },
                                    };
                                    const findItem = list.find(
                                      (item) =>
                                        item.optionName ===
                                        optionObj.optionCategoryName,
                                    );
                                    if (findItem) {
                                      list = list.filter(
                                        (item) =>
                                          item.optionName !==
                                          optionObj.optionCategoryName,
                                      );
                                    }
                                    return [...list, option];
                                  })
                                }
                                items={optionObj.options
                                  .slice(1)
                                  .map((option, i) => {
                                    return {
                                      label:
                                        option.price > 0
                                          ? `${option.name} +${comma(
                                              option.price,
                                            )}`
                                          : option.name,
                                      value: JSON.stringify({
                                        name: option.name,
                                        price: option.price,
                                      }),
                                    };
                                  })}
                              />
                            )}
                          </Box>
                        );
                      } else if (optionObj.type === "input") {
                        return (
                          <Box key={`option${optionObj.id}`}>
                            <Input
                              placeholder={optionObj.optionCategoryName}
                              onChangeText={(text: string) =>
                                setOptionText(text)
                              }
                            />
                          </Box>
                        );
                      }
                    })}
                  </ScrollView>
                </Box>
              )}
              <Box>
                <InfoText style={{ margin: 0 }}>배송</InfoText>
                <Text style={{ fontWeight: "bold", marginLeft: 5 }}>
                  {productDetail.shippingPrice === 0
                    ? "무료배송"
                    : `${comma(productDetail.shippingPrice)}원`}
                </Text>
              </Box>
              <Box style={{ marginTop: 10 }}>
                <BuyButton
                  onPress={goProductBuy}
                  disabled={productDetail.soldOut}
                  style={{
                    ...(productDetail.soldOut && {
                      backgroundColor: colors.opacityText,
                      borderColor: colors.opacityText,
                    }),
                  }}
                >
                  <Text style={{ color: colors.whiteColor }}>구매하기</Text>
                </BuyButton>
                <CartButton
                  style={{
                    ...(productDetail.soldOut && {
                      color: colors.opacityText,
                      borderColor: colors.opacityText,
                    }),
                  }}
                  disabled={productDetail.soldOut}
                  onPress={addCart}
                >
                  <Text style={{ color: colors.accent }}>장바구니에 넣기</Text>
                </CartButton>
              </Box>
              <Description>
                <HTML source={{ html: productDetail.description }} />
              </Description>
            </ProductInfo>
          </Container>
        ) : (
          <Container>
            <Text>Loading</Text>
          </Container>
        )}
      </DismissKeyboard>
    </ScreenLayout>
  );
}

export default Detail;
