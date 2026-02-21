import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { preventionTheme } from "@/constants/tokens";
import { TouchableOpacity, View } from "react-native";

export default function OnboardingStepOne() {
  return (
    <View className="flex items-center gap-4 bg-background">
      <View></View>
      <View></View>
      <View className="flex gap-2 items-center">
        <TouchableOpacity className="rounded-md bg-blue-500 flex flex-row items-center justify-center">
          Get started
        </TouchableOpacity>
      </View>
    </View>
  );
}
