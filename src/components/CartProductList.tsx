import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { Checkbox } from "react-native-paper";
import styled from "styled-components/native";
import { colors } from "../../colors";
import { BuyProductDetailType } from "../../types";
import { useAppDispatch } from "../app/hooks";
import { remove } from "../app/store";
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

const ScrollBox = styled.ScrollView``;

const ProductItem = styled.TouchableOpacity<CheckedProp>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 10px;
  ${(props) => props.checked && `border: 2px solid ${colors.accent}`};
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
  margin: 0 5px;
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
  font-size: 20px;
  text-align: right;
`;

const ActionBox = styled.TouchableOpacity`
  padding: 0px 6px;
  border: 1px solid ${colors.opacityText};
  border-radius: 5px;
`;

interface CheckedProp {
  checked: boolean;
}

interface CartProductListProp {
  products?: BuyProductDetailType[];
  getCheckedItem: Function;
}

const CartProductList: React.FC<CartProductListProp> = ({
  products,
  getCheckedItem,
}) => {
  const dispatch = useAppDispatch();
  const [checkItem, setCheckItem] = useState<string[]>([]);
  const { width, height } = useWindowDimensions();
  const filterList = products?.filter(
    (item) => !item.soldOut && checkItem.includes(item.prefix),
  );
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

  useEffect(() => {
    getCheckedItem(filterList);
  }, [checkItem]);

  const allCheck = () => {
    products?.forEach((item) => {
      if (!item.soldOut) {
        setCheckItem((prev) => [...prev, item.prefix]);
      }
    });
  };

  const allUnCheck = () => {
    setCheckItem([]);
  };

  const removeCheckItem = () => {
    checkItem.forEach((prefix) => dispatch(remove({ prefix })));
  };

  return (
    <Container>
      <RowBox
        style={{
          justifyContent: "space-between",
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
        <RowBox>
          <ActionBox onPress={allCheck}>
            <InfoText>전체 선택</InfoText>
          </ActionBox>
          <ActionBox
            onPress={allUnCheck}
            style={{
              marginLeft: 5,
            }}
          >
            <InfoText>전체 해제</InfoText>
          </ActionBox>
          <ActionBox
            onPress={removeCheckItem}
            style={{
              marginLeft: 5,
            }}
          >
            <InfoText>선택 삭제</InfoText>
          </ActionBox>
        </RowBox>
      </RowBox>
      <ScrollBox>
        {products?.map((product) => (
          <ProductItem
            checked={checkItem?.includes(product.prefix)}
            onPress={() => {
              if (checkItem?.includes(product.prefix)) {
                setCheckItem((prev) =>
                  prev?.filter((item) => item !== product.prefix),
                );
              } else {
                setCheckItem((prev) => [...prev, product.prefix]);
              }
            }}
            key={product.prefix}
          >
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

export default CartProductList;
