import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number;
  color: string;
}

export function ProgressBar({ progress, color }: ProgressBarProps) {
  return (
    <View
      style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: "#E8E8E8",
        marginTop: 8,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(progress * 100, 100)}%`,
          height: "100%",
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
