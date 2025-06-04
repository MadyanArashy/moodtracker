import React, { useRef } from 'react';
import { Animated, Pressable, Text, ViewStyle, StyleProp } from 'react-native';

type AnimationType = 'scale' | 'opacity' | 'color';

interface AnimatedButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animationType?: AnimationType;
  disabled?: boolean;
  activeColor?: string;   // warna saat ditekan
  inactiveColor?: string; // warna default
}

const AnimatedButton = ({
  onPress,
  onLongPress,
  children,
  style,
  animationType = 'scale',
  disabled,
  activeColor = '#cccccc',
  inactiveColor = '#ffffff'
}: AnimatedButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    if (animationType === 'scale') {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    } else if (animationType === 'opacity') {
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else if (animationType === 'color') {
      Animated.timing(colorAnim, {
        delay: 50,
        toValue: 1,
        duration: 90,
        useNativeDriver: false, // color animation needs to be false
      }).start();
    }
  };

  const animateOut = () => {
    if (animationType === 'scale') {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else if (animationType === 'opacity') {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else if (animationType === 'color') {
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  let animatedStyle: any = {};

  if (animationType === 'scale') {
    animatedStyle = { transform: [{ scale }] };
  } else if (animationType === 'opacity') {
    animatedStyle = { opacity };
  } else if (animationType === 'color') {
    animatedStyle = { backgroundColor };
  }

  return (
    <Pressable
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;
