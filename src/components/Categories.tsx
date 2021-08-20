import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../colors";
import { CategoryType } from "../../types";
import ssomeeApi from "../api";
import { RootStackParamList } from "../navigators/StackNavigator";
import { Slider } from "./Slider";

const Container = styled.View`
  padding: 10px;
`;

const CategoryItem = styled.TouchableOpacity<CategorySelectedProps>`
  font-size: 13px;
  height: 25px;
  min-width: 50px;
  padding: 3px 5px;
  border-radius: 15px;
  border: 1px solid ${colors.accent};
  background-color: ${(props) =>
    props.selected ? colors.hoverColor : colors.whiteColor};
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

const CategoryName = styled.Text<CategorySelectedProps>`
  ${(props) => (props.selected ? `color: ${colors.whiteColor}` : "")};
`;

interface CategorySelectedProps {
  selected?: boolean;
}

interface CategoriesProps {
  selectedId?: number;
}

const Categories: React.FC<CategoriesProps> = ({ selectedId }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<CategoryType[]>();
  useEffect(() => {
    ssomeeApi.getCategories().then(({ data }) => setCategories(data));
  }, []);
  const goToCategory = ({ id, name }: CategoryType) => {
    navigation.navigate("Category", {
      id,
      name,
    });
  };
  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={{ flexDirection: "row" }}
      >
        {categories?.map((category) => (
          <CategoryItem
            selected={selectedId === category.id}
            onPress={() =>
              goToCategory({ id: category.id, name: category.name })
            }
            key={category.id}
          >
            <CategoryName selected={selectedId === category.id}>
              {category.name}
            </CategoryName>
          </CategoryItem>
        ))}
      </ScrollView>
    </Container>
  );
};

export default Categories;
