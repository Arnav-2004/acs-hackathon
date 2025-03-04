import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

export function IconsUser() {
  return (
 
    <Svg width="32" height="32" viewBox="0 0 22 22" fill="none">
    <Defs>
      <LinearGradient id="paint0_linear_55_41" x1="11" y1="6.49988" x2="11" y2="15.5" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#6722A8" />
        <Stop offset="1" stopColor="#372B76" />
      </LinearGradient>
      <LinearGradient id="paint1_linear_55_41" x1="11" y1="1" x2="11" y2="21" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#6722A8" />
        <Stop offset="1" stopColor="#372B76" />
      </LinearGradient>
    </Defs>

    {/* First Path with solid black stroke */}
    <Path
      d="M12.721 12.721C13.104 12.338 13.323 11.828 13.761 10.807L15.317 7.17496C15.474 6.80996 15.552 6.62796 15.462 6.53796C15.372 6.44796 15.19 6.52596 14.825 6.68296L11.193 8.23896C10.172 8.67696 9.66202 8.89596 9.27902 9.27896C8.89602 9.66196 8.67702 10.172 8.23902 11.193L6.68302 14.825C6.52602 15.19 6.44802 15.372 6.53802 15.462C6.62802 15.552 6.81002 15.474 7.17502 15.317L10.807 13.761C11.828 13.323 12.338 13.104 12.721 12.721ZM12.721 12.721L9.28002 9.27996"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Second Path with gradient stroke */}
    <Path
      d="M12.721 12.721C13.104 12.338 13.323 11.828 13.761 10.807L15.317 7.17496C15.474 6.80996 15.552 6.62796 15.462 6.53796C15.372 6.44796 15.19 6.52596 14.825 6.68296L11.193 8.23896C10.172 8.67696 9.66202 8.89596 9.27902 9.27896C8.89602 9.66196 8.67702 10.172 8.23902 11.193L6.68302 14.825C6.52602 15.19 6.44802 15.372 6.53802 15.462C6.62802 15.552 6.81002 15.474 7.17502 15.317L10.807 13.761C11.828 13.323 12.338 13.104 12.721 12.721ZM12.721 12.721L9.28002 9.27996"
      stroke="url(#paint0_linear_55_41)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Third Path with solid black stroke */}
    <Path
      d="M21 11C21 16.523 16.523 21 11 21M21 11C21 5.477 16.523 1 11 1M21 11H19.5M11 21C5.477 21 1 16.523 1 11M11 21V19.5M1 11C1 5.477 5.477 1 11 1M1 11H2.5M11 1V2.5"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Fourth Path with gradient stroke */}
    <Path
      d="M21 11C21 16.523 16.523 21 11 21M21 11C21 5.477 16.523 1 11 1M21 11H19.5M11 21C5.477 21 1 16.523 1 11M11 21V19.5M1 11C1 5.477 5.477 1 11 1M1 11H2.5M11 1V2.5"
      stroke="url(#paint1_linear_55_41)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>  );
}
