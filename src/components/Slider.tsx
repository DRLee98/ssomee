import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../colors";
import { View } from "react-native";
import { useEffect } from "react";

const SliderContainer = styled.View<SliderContainerProps>`
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  height: ${(prop) => prop.height}px;
  & + & {
    margin-top: 10px;
  }
`;

const SliderBox = styled.View<SliderBoxProps>`
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  width: 85%;
  margin: auto;
`;

const SliderList = styled.View<SliderListProps>`
  flex-direction: row;
  width: max-content;
  transform: translateX(${(prop) => (prop.scroll > 0 ? 0 : prop.scroll)}px);
`;

export const NextBtn = styled.TouchableOpacity`
  color: ${colors.accent};
  font-size: 30px;
  position: absolute;
  right: 5px;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 0 5px 0 10px;
  border-radius: 999px;
  &:hover {
    background-color: ${colors.hoverColor};
  }
`;

export const PrevBtn = styled.TouchableOpacity`
  color: ${colors.accent};
  font-size: 30px;
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 0 10px 0 5px;
  border-radius: 999px;
  &:hover {
    background-color: ${colors.hoverColor};
  }
`;

interface SliderContainerProps {
  height: number;
}

interface SliderBoxProps {
  margin: boolean;
}

interface SliderListProps {
  scroll: number;
}

interface SliderProps {
  slideWidth: number;
}

export const Slider: React.FC<SliderProps> = ({ slideWidth, children }) => {
  const [scroll, setScroll] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [blockWidth, setBlockWidth] = useState<number>(0);
  const [listWidth, setListWidth] = useState<number>(0);

  const nextBtn = () => {
    setScroll((prev) => (prev -= slideWidth));
  };

  const prevBtn = () => {
    setScroll((prev) => (prev += slideWidth));
  };

  const sliderBoxLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setBlockWidth(width);
    setHeight(height);
  };

  const sliderListLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setListWidth(width);
  };

  return (
    <SliderContainer height={height}>
      <PrevBtn onPress={prevBtn}>
        <AntDesign name="caretleft" size={15} color={colors.accent} />
      </PrevBtn>
      <SliderBox onLayout={sliderBoxLayout} margin={listWidth > blockWidth}>
        <SliderList onLayout={sliderListLayout} scroll={scroll}>
          {children}
        </SliderList>
      </SliderBox>
      <NextBtn onPress={nextBtn}>
        <AntDesign name="caretright" size={15} color={colors.accent} />
      </NextBtn>
    </SliderContainer>
  );
};
