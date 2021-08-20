import React, { ReactChild } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

interface DismissKeyboardProp {
  children: ReactChild;
}

const DismissKeyboard: React.FC<DismissKeyboardProp> = ({ children }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
