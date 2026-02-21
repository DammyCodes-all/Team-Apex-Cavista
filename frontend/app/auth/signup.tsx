import { SafeAreaView, Text, View } from "react-native";

export default function SignupScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <View className="flex-1 items-center justify-center px-l">
        <Text
          className="text-center"
          style={{ fontSize: 24, fontWeight: "600" }}
        >
          Sign Up (Dummy)
        </Text>
        <Text
          className="mt-s text-center"
          style={{ fontSize: 16, color: "#666666" }}
        >
          This is a placeholder for the signup screen.
        </Text>
      </View>
    </SafeAreaView>
  );
}
