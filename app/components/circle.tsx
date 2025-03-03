import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Circle() {
  return (
    <svg
      style={{
        transform: "scale(0.8) translateY(-75px) translateX(-62px)",
        zIndex: -1,
        position: "absolute",
        borderTopLeftRadius: 10,
        opacity: '0.75 '
      }}
      width="499"
      height="300"
      viewBox="0 0 499 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_25_29)">
        <ellipse
          cx="56.5"
          cy="-22"
          rx="242.5"
          ry="246"
          transform="rotate(180 56.5 -22)"
          fill="url(#paint0_linear_25_29)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_25_29"
          x="-386"
          y="-468"
          width="885"
          height="892"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="100"
            result="effect1_foregroundBlur_25_29"
          />
        </filter>
        <linearGradient
          id="paint0_linear_25_29"
          x1="-46.4795"
          y1="-178.073"
          x2="-127.659"
          y2="22.5966"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0439996" stop-color="#6722A8" />
          <stop offset="0.509" stop-color="#FF4203" />
          <stop offset="0.754" stop-color="#FF8503" />
        </linearGradient>
      </defs>
    </svg>
  );
}
