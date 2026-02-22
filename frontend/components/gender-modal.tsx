import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";

export const GENDER_OPTIONS = [
  { id: "female", label: "Female", icon: "female" },
  { id: "male", label: "Male", icon: "male" },
] as const;

interface GenderModalProps {
  visible: boolean;
  selectedGender: string | null;
  activeColor: string;
  onSelect: (genderId: string) => void;
  onClose: () => void;
}

export function GenderModal({
  visible,
  selectedGender,
  activeColor,
  onSelect,
  onClose,
}: GenderModalProps) {
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
            maxHeight: "70%",
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
              Select Gender
            </Text>

            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <MaterialIcons name="close" size={24} color="#90A2B7" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={true}>
            <View style={{ gap: 10 }}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => onSelect(option.id)}
                  activeOpacity={0.8}
                  className="flex-row items-center rounded-2xl"
                  style={{
                    backgroundColor:
                      selectedGender === option.id ? "#E8F4F9" : "#F5F8FB",
                    borderWidth: 2,
                    borderColor:
                      selectedGender === option.id ? activeColor : "#D3DEE8",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <MaterialIcons
                    name={option.icon as any}
                    size={24}
                    color={
                      selectedGender === option.id ? activeColor : "#90A2B7"
                    }
                  />
                  <Text
                    style={{
                      marginLeft: 12,
                      color:
                        selectedGender === option.id ? activeColor : "#2D3449",
                      fontSize: 16,
                      fontFamily: preventionTheme.typography.family.medium,
                      flex: 1,
                    }}
                  >
                    {option.label}
                  </Text>

                  {selectedGender === option.id && (
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={activeColor}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.85}
            className="h-12 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "#DCE8EF",
              marginTop: 16,
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
