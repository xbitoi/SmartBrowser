// Powered by OnSpace.AI
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  PanResponder,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSettings } from '@/hooks/useSettings';
import MarqueeBanner from '@/components/MarqueeBanner';
import BroadcastPopup from '@/components/BroadcastPopup';
import LoadingScreen from '@/components/LoadingScreen';
import { Colors, Spacing } from '@/constants/theme';

export default function MainScreen() {
  const { settings, isLoading } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [webLoading, setWebLoading] = useState(true);

  const swipeRef = useRef({
    startX: 0,
    lastX: 0,
    lastDirection: 0,
    swipeCount: 0,
    completed: false,
  });

  // Show popup when broadcast is active
  useEffect(() => {
    if (settings.broadcastMessage?.isActive && settings.broadcastMessage?.text) {
      setShowPopup(true);
    }
  }, [settings.broadcastMessage?.isActive, settings.broadcastMessage?.text]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      swipeRef.current = {
        startX: e.nativeEvent.locationX,
        lastX: e.nativeEvent.locationX,
        lastDirection: 0,
        swipeCount: 0,
        completed: false,
      };
    },
    onPanResponderMove: (e) => {
      if (swipeRef.current.completed) return;
      const currentX = e.nativeEvent.locationX;
      const deltaX = currentX - swipeRef.current.startX;

      if (Math.abs(deltaX) > 40) {
        const currentDir = Math.sign(deltaX);
        if (swipeRef.current.lastDirection !== 0 && currentDir !== swipeRef.current.lastDirection) {
          swipeRef.current.swipeCount++;
          swipeRef.current.startX = currentX;
        } else if (swipeRef.current.lastDirection === 0) {
          swipeRef.current.lastDirection = currentDir;
          swipeRef.current.startX = currentX;
        }
        swipeRef.current.lastDirection = currentDir;

        if (swipeRef.current.swipeCount >= 5) {
          swipeRef.current.completed = true;
          router.push('/login');
        }
      }
      swipeRef.current.lastX = currentX;
    },
  });

  if (isLoading) return <LoadingScreen />;

  if (!settings.isActive) {
    return (
      <View style={[styles.offContainer, { paddingTop: insets.top }]}>
        <MaterialIcons name="power-off" size={64} color={Colors.error} />
        <Text style={styles.offTitle}>التطبيق متوقف حالياً</Text>
        <Text style={styles.offDesc}>
          عذراً، التطبيق غير متاح في الوقت الحالي. يرجى المحاولة في وقت لاحق.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Marquee Banner - swipe gesture to open settings */}
      <View {...panResponder.panHandlers}>
        <MarqueeBanner settings={settings} />
      </View>

      {/* WebView Area */}
      <View style={styles.webContainer}>
        {settings.url ? (
          <>
            <WebView
              source={{ uri: settings.url }}
              style={styles.webview}
              onLoadStart={() => setWebLoading(true)}
              onLoadEnd={() => setWebLoading(false)}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
            />
            {webLoading ? (
              <View style={styles.webLoadingOverlay}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyUrl}>
            <MaterialIcons name="link-off" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyUrlText}>لم يتم تعيين رابط بعد</Text>
          </View>
        )}
      </View>

      {/* Broadcast Popup */}
      <BroadcastPopup
        visible={showPopup}
        message={settings.broadcastMessage?.text || ''}
        onClose={() => setShowPopup(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyUrl: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emptyUrlText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  offContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  offTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  offDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
