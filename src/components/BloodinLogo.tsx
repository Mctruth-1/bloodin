import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface BloodinLogoProps {
  size?: number;
  inverted?: boolean;
}

/**
 * Minimalist geometric blood droplet merged with a subtle DNA double-helix /
 * medical plus-sign motif in deep crimson (#D92D20) and crisp white.
 */
export const BloodinLogo: React.FC<BloodinLogoProps> = ({
  size = 44,
  inverted = false,
}) => {
  const bg = inverted ? '#FFFFFF' : COLORS.crimson;
  const fg = inverted ? COLORS.crimson : '#FFFFFF';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Rounded Geometric Shield / App Icon Base */}
        <Path
          d="M16 4H48C54.6274 4 60 9.37258 60 16V48C60 54.6274 54.6274 60 48 60H16C9.37258 60 4 54.6274 4 48V16C4 9.37258 9.37258 4 16 4Z"
          fill={bg}
        />
        {/* Outer Geometric Blood Droplet Silhouette */}
        <Path
          d="M32 11C32 11 17 27.2 17 38.5C17 46.7843 23.7157 53.5 32 53.5C40.2843 53.5 47 46.7843 47 38.5C47 27.2 32 11 32 11Z"
          fill={fg}
        />
        {/* Inner DNA Helix / Plus-Sign Motif carved in Crimson */}
        <Path
          d="M32 25V45M23 35H41"
          stroke={bg}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        {/* Subtle DNA Helix Arcs */}
        <Path
          d="M26 28C29 31 35 31 38 28M26 42C29 39 35 39 38 42"
          stroke={bg}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <Circle cx="32" cy="21" r="2" fill={bg} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
