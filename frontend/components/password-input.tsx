import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TextInput, TouchableOpacity, View } from "react-native";

type PasswordInputProps = {
  placeholder?: string;
  placeholderTextColor?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  textColor?: string;
  fontFamily?: string;
  borderColor?: string;
  backgroundColor?: string;
};

export function PasswordInput({
  placeholder = "Password",
  placeholderTextColor,
  value,
  onChangeText,
  textColor = "#1A1A1A",
  fontFamily,
  borderColor = "#E0E0E0",
  backgroundColor = "#FFFFFF",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View
      className="flex-row items-center rounded-input px-m"
      style={{
        backgroundColor,
        borderColor,
        borderWidth: 1,
        height: 54,
      }}
    >
      <MaterialIcons name="lock-outline" size={20} color="#8A9AAF" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={!visible}
        className="ml-s flex-1"
        value={value}
        onChangeText={onChangeText}
        style={{
          color: textColor,
          fontSize: 16,
          fontFamily,
        }}
      />
      <TouchableOpacity onPress={() => setVisible((prev) => !prev)}>
        <MaterialIcons
          name={visible ? "visibility-off" : "visibility"}
          size={20}
          color="#8A9AAF"
        />
      </TouchableOpacity>
    </View>
  );
}
