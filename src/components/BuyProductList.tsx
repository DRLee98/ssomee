import React from "react";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../colors";
import { BuyProductDetailType, ProductDetailType } from "../../types";
import ssomeeApi from "../api";
import { comma } from "../utils";

const Container = styled.View`
  width: 100%;
`;

const Box = styled.View``;

const InfoText = styled.Text`
  color: ${colors.opacityText};
  font-size: 14px;
  font-weight: 500;
`;

const ScrollBox = styled.ScrollView`
  margin: 10px;
`;

const ProductItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
`;

const SoldOutText = styled.Text`
  font-weight: bold;
  font-size: 40px;
  color: #444444cc;
  background-color: #ffffff80;
  padding: 5px 15px;
`;

const RowBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProductImage = styled.Image`
  max-width: 80px;
  max-height: 80px;
  margin-right: 5px;
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
  max-width: 75%;
`;

const Price = styled.Text`
  font-weight: bold;
  font-size: 14px;
  text-align: right;
`;

const TotalPrice = styled.Text`
  font-weight: bold;
  font-size: 20;
  text-align: right;
`;

interface BuyProductListProp {
  products?: BuyProductDetailType[];
}

const BuyProductList: React.FC<BuyProductListProp> = ({ products }) => {
  const filterList = products?.filter((item) => !item.soldOut);
  let totalPrice = 0;
  filterList?.forEach((item) => {
    totalPrice += item.ssomeePrice;
    totalPrice += item.shippingPrice;
    item.selectedOptions.forEach((option) => {
      if (option.optionValue?.price && option.optionValue.price > 0) {
        totalPrice += option.optionValue.price;
      }
    });
  });
  const { width, height } = useWindowDimensions();
  return (
    <Container>
      <Box
        style={{
          borderBottomWidth: 1,
          borderStyle: "solid",
          borderColor: colors.opacityText,
          padding: 5,
        }}
      >
        <InfoText>
          총 {products?.filter((item) => item.soldOut === false).length || 0}
          개의 상품
        </InfoText>
      </Box>
      <ScrollBox>
        {products?.map((product) => (
          <ProductItem key={product.prefix}>
            <RowBox style={{ maxWidth: "65%" }}>
              <ProductImage
                resizeMode="cover"
                style={{ width: width / 5, height: width / 5 }}
                source={{ uri: product.mainImage }}
              />
              <Box style={{ width: "80%" }}>
                <BrandName>{product.brand.name}</BrandName>
                <Name>{product.name}</Name>
                <RowBox>
                  {product.selectedOptions.length > 0 &&
                    product.selectedOptions.map((option, i) => (
                      <RowBox key={`selectedOptions${i}`}>
                        {i > 0 && (
                          <InfoText style={{ fontSize: 12 }}> / </InfoText>
                        )}
                        <InfoText style={{ fontSize: 12 }}>
                          {option.optionName}
                        </InfoText>
                        {option.optionValue && (
                          <InfoText style={{ fontSize: 12 }}>
                            : {option.optionValue.name}{" "}
                          </InfoText>
                        )}
                        {option.optionValue?.price &&
                        option.optionValue.price > 0 ? (
                          <InfoText style={{ fontSize: 12 }}>
                            {" "}
                            +{comma(option.optionValue.price)}원
                          </InfoText>
                        ) : null}
                      </RowBox>
                    ))}
                </RowBox>
              </Box>
            </RowBox>
            <Box>
              <Price>
                {comma(product.ssomeePrice + product.shippingPrice)}원
              </Price>
              {product.shippingPrice > 0 && (
                <InfoText style={{ fontSize: 12 }}>
                  ({comma(product.ssomeePrice)}원 + 배송비{" "}
                  {comma(product.shippingPrice)}원{" "}
                  {product.selectedOptions.map((item) => {
                    if (
                      item.optionValue &&
                      item.optionValue.price &&
                      item.optionValue.price > 0
                    ) {
                      return `${item.optionName}:${
                        item.optionValue.name
                      } +${comma(item.optionValue.price)}원`;
                    }
                  })}
                  )
                </InfoText>
              )}
            </Box>
            {product.soldOut && (
              <SoldOutBox>
                <SoldOutText>Sold Out</SoldOutText>
              </SoldOutBox>
            )}
          </ProductItem>
        ))}
      </ScrollBox>
      <Box
        style={{
          borderTopWidth: 1,
          borderStyle: "solid",
          borderColor: colors.opacityText,
          padding: 5,
        }}
      >
        <TotalPrice>총{comma(totalPrice)}원</TotalPrice>
      </Box>
    </Container>
  );
};

export default BuyProductList;
