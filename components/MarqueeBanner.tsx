// Powered by OnSpace.AI
import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, Dimensions } from 'react-native';
import { AppSettings } from '@/constants/config';

interface Props {
  settings: AppSettings;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MarqueeBanner({ settings }: Props) {
  const translateX = useRef(new Animated.Value(settings.marqueeDirection === 'rtl' ? SCREEN_WIDTH : -SCREEN_WIDTH)).current;

  useEffect(() => {
    const startAnim = () => {
      const isRTL = settings.marqueeDirection === 'rtl';
      translateX.setValue(isRTL ? SCREEN_WIDTH : -SCREEN_WIDTH);
      const duration = Math.max(3000, (SCREEN_WIDTH * 2) / (settings.marqueeSpeed / 10));

      Animated.loop(
        Animated.timing(translateX, {
          toValue: isRTL ? -SCREEN_WIDTH : SCREEN_WIDTH,
          duration,
          useNativeDriver: true,
        })
      ).start();
    };
    startAnim();
  }, [settings.marqueeDirection, settings.marqueeSpeed, settings.welcomeMessage]);

  const bannerBg = hexToRgba(settings.themeColor, settings.bannerOpacity / 100);

  return (
    <View style={[styles.container, { backgroundColor: bannerBg }]}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Text
          style={[
            styles.text,
            {
              fontSize: settings.bannerFontSize,
              color: settings.bannerTextColor,
            },
          ]}
          numberOfLines={1}
        >
          {settings.welcomeMessage}
          {'          '}
          {settings.welcomeMessage}
          {'          '}
          {settings.welcomeMessage}
        </Text>
      </Animated.View>
    </View>
  );
}

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    overflow: 'hidden',
  },
  text: {
    fontWeight: '600',
    whiteSpace: 'nowrap',
  } as any,
});
