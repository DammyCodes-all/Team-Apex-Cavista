import Svg, { Path, Circle, Rect } from "react-native-svg";

export function ShieldIcon({ size = 140 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      {/* Shield body */}
      <Path
        d="M70 12C70 12 28 30 28 65C28 100 70 128 70 128C70 128 112 100 112 65C112 30 70 12 70 12Z"
        fill="#B5DCF0"
        stroke="#7EC8E3"
        strokeWidth={2.5}
      />
      {/* Inner shield highlight */}
      <Path
        d="M70 22C70 22 38 37 38 66C38 95 70 118 70 118C70 118 70 37 70 22Z"
        fill="#C9E8F5"
        opacity={0.6}
      />
      {/* Cross vertical */}
      <Rect x={64} y={52} width={12} height={40} rx={3} fill="#FFFFFF" />
      {/* Cross horizontal */}
      <Rect x={50} y={66} width={40} height={12} rx={3} fill="#FFFFFF" />
      {/* Dotted arc (right side) */}
      {[0, 25, 50, 75, 100, 125, 150, 175].map((angle, i) => {
        const rad = ((angle - 90 + 20) * Math.PI) / 180;
        const cx = 88 + 22 * Math.cos(rad);
        const cy = 68 + 22 * Math.sin(rad);
        return (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={2.2}
            fill="#7EC8E3"
            opacity={0.7 + i * 0.03}
          />
        );
      })}
    </Svg>
  );
}
