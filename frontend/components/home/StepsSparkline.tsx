import React from "react";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const SCREEN_WIDTH = Dimensions.get("window").width;

interface StepsSparklineProps {
  data: number[];
}

export function StepsSparkline({ data }: StepsSparklineProps) {
  const W = (SCREEN_WIDTH - 72) / 2 - 24;
  const H = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    const cp1y = points[i - 1].y;
    const cp2x = (points[i - 1].x + points[i].x) / 2;
    const cp2y = points[i].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  return (
    <Svg width={W} height={H + 4} style={{ marginTop: 8 }}>
      <Path d={d} fill="none" stroke={colors.primary} strokeWidth={2.5} />
    </Svg>
  );
}
