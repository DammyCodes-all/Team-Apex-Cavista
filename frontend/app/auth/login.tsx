import { SafeAreaView, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <View className="flex-1 items-center justify-center px-l">
        <Text
          className="text-center"
          style={{ fontSize: 24, fontWeight: "600" }}
        >
          Login (Dummy)
        </Text>
        <Text
          className="mt-s text-center"
          style={{ fontSize: 16, color: "#666666" }}
        >
          This is a placeholder for the login screen.
        </Text>
      </View>
    </SafeAreaView>
  );
}
