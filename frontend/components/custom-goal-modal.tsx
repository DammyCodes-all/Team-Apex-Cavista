import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";

interface CustomGoalModalProps {
  visible: boolean;
  value: string;
  primaryColor: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function CustomGoalModal({
  visible,
  value,
  primaryColor,
  onChangeText,
  onSave,
  onClose,
}: CustomGoalModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 32,
          }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: 16 }}
          >
            <Text
              style={{
                color: "#2D3449",
                fontSize: 18,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Custom Goal
            </Text>

            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <MaterialIcons name="close" size={24} color="#90A2B7" />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: "#4E6177",
              fontSize: 14,
              fontFamily: preventionTheme.typography.family.body,
              marginBottom: 12,
            }}
          >
            Tell us what matters most to you for your health journey
          </Text>

          <View
            className="flex-row items-start rounded-2xl"
            style={{
              backgroundColor: "#F5F8FB",
              borderWidth: 1,
              borderColor: "#D3DEE8",
              paddingHorizontal: 14,
              paddingVertical: 12,
              minHeight: 100,
            }}
          >
            <TextInput
              placeholder="Enter your custom goal"
              placeholderTextColor="#8A9CB1"
              multiline
              maxLength={150}
              value={value}
              onChangeText={onChangeText}
              style={{
                flex: 1,
                color: "#2D3449",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.body,
              }}
            />
          </View>

          <Text
            style={{
              color: "#8A9CB1",
              fontSize: 12,
              fontFamily: preventionTheme.typography.family.body,
              marginTop: 8,
              textAlign: "right",
            }}
          >
            {value.length}/150
          </Text>

          <TouchableOpacity
            onPress={onSave}
            activeOpacity={0.85}
            className="h-12 items-center justify-center rounded-2xl mt-4"
            style={{
              backgroundColor: primaryColor,
              opacity: value.trim() ? 1 : 0.5,
            }}
            disabled={!value.trim()}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.medium,
              }}
            >
              Save Goal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.85}
            className="h-12 items-center justify-center rounded-2xl mt-2"
            style={{
              backgroundColor: "#DCE8EF",
            }}
          >
            <Text
              style={{
                color: "#2F80ED",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.medium,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
