import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { colors } from "../../colors";
import { BuyProductDetailType } from "../../types";
import ssomeeApi from "../api";
import BuyProductList from "../components/BuyProductList";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
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
  text-align: center;
  font-weight: bold;
  color: ${colors.whiteColor};
  width: 100%;
`;

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Buy">;
  route: RouteProp<RootStackParamList, "Buy">;
}

function Buy({ navigation, route }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [buyLoading, setBuyLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<BuyProductDetailType[]>();
  useEffect(() => {
    if (route?.params?.products) {
      setLoading(true);
      navigation.setOptions({
        title: "구매하기",
      });
      setProducts(route.params.products);
      setLoading(false);
    }
  }, []);

  const filterList = products?.filter((item) => !item.soldOut);

  const buy = async () => {
    let status: { msg: string[]; ok: boolean } = { msg: [], ok: true };
    if (filterList) {
      for (let i = 0; i < filterList.length; i++) {
        const data = await ssomeeApi
          .postBuyProduct({
            prefix: filterList[i].prefix,
          })
          .catch((error) => {
            console.log(error);
            // status.ok = false;
            // status.msg = [
            //   ...status.msg,
            //   `${filterList[i].name} 상품 구매에 실패하였습니다`,
            // ];
          });
        if (data?.status !== 200) {
          status.ok = false;
          status.msg = [
            ...status.msg,
            `${filterList[i].name} 상품 구매에 실패하였습니다`,
          ];
        }
      }
    }
    if (status.ok) {
      alert(`${filterList?.length}개의 상품을 성공적으로 구매하였습니다`);
    } else {
      let alertMsg = "";
      status.msg.forEach((msg, i) =>
        i > 0 ? (alertMsg += `\n${msg}`) : (alertMsg += msg),
      );

      alert(alertMsg);
    }
  };

  return (
    <ScreenLayout loading={loading}>
      <DismissKeyboard>
        <Container>
          <BuyProductList products={products} />
          <Button onPress={buy} disabled={products?.length === 0}>
            <Text>구매하기</Text>
          </Button>
        </Container>
      </DismissKeyboard>
    </ScreenLayout>
  );
}

export default Buy;
