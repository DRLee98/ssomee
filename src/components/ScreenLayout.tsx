import React, { ReactChild } from "react";
import { ActivityIndicator, View } from "react-native";

interface ScreenLayoutProp {
  loading: boolean;
  children: ReactChild;
}

const ScreenLayout: React.FC<ScreenLayoutProp> = ({ loading, children }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 900,
        width: "100%",
        padding: 20,
        margin: "auto",
      }}
    >
      {loading ? <ActivityIndicator color="gray" /> : children}
    </View>
  );
};

export default ScreenLayout;
