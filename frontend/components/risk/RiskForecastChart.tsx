import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";

import { preventionTheme } from "@/constants/tokens";
import { normalizeRiskScore } from "./utils";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const SCREEN_WIDTH = Dimensions.get("window").width;

export function RiskForecastChart({ riskData }: { riskData: number[] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const blueData =
    riskData.length === 7
      ? riskData.map((value) => 100 - normalizeRiskScore(value))
      : [42, 38, 44, 40, 46, 43, 40];
  const redData =
    riskData.length === 7 ? riskData : [30, 28, 34, 30, 32, 35, 38];
  const chartW = SCREEN_WIDTH - 80;
  const chartH = 100;
  const maxVal = 60;

  const toPoint = (data: number[], i: number) => ({
    x: (i / (data.length - 1)) * chartW,
    y: chartH - (data[i] / maxVal) * chartH,
  });

  const buildPath = (data: number[]) => {
    const pts = data.map((_, i) => toPoint(data, i));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cpx1 = (pts[i - 1].x + pts[i].x) / 2;
      const cpy1 = pts[i - 1].y;
      const cpx2 = (pts[i - 1].x + pts[i].x) / 2;
      const cpy2 = pts[i].y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: colors.inputBorder,
      }}
    >
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.bodyLg,
          lineHeight: typo.lineHeight.bodyLg,
          color: colors.textPrimary,
          marginBottom: 16,
        }}
      >
        7-Day Risk Forecast
      </Text>

      <Svg width={chartW} height={chartH + 30}>
        {/* Grid lines */}
        {[0, 1, 2, 3].map((i) => (
          <Line
            key={i}
            x1={0}
            y1={(i / 3) * chartH}
            x2={chartW}
            y2={(i / 3) * chartH}
            stroke="#F0F0F0"
            strokeWidth={1}
          />
        ))}
        {/* Blue line */}
        <Path
          d={buildPath(blueData)}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2.5}
        />
        {/* Red line */}
        <Path
          d={buildPath(redData)}
          fill="none"
          stroke={colors.error}
          strokeWidth={2.5}
          strokeDasharray="6 4"
        />
        {/* Day labels */}
        {days.map((day, i) => (
          <SvgText
            key={day}
            x={(i / (days.length - 1)) * chartW}
            y={chartH + 22}
            textAnchor="middle"
            fill={colors.textSecondary}
            fontSize={11}
            fontFamily={typo.family.body}
          >
            {day}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
