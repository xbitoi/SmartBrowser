// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSettings } from '@/hooks/useSettings';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function LoginScreen() {
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
    if (password === settings.settingsPassword) {
      router.replace('/settings');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.centerContent}>
          {/* Lock Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="lock" size={40} color={Colors.primary} />
          </View>

          <Text style={styles.title}>تسجيل الدخول للإعدادات</Text>
          <Text style={styles.subtitle}>أدخل كلمة مرور المشرف للمتابعة</Text>

          {/* Password Field */}
          <View style={[styles.inputWrapper, error && styles.inputError]}>
            <MaterialIcons name="key" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              autoFocus
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons
                name={showPass ? 'visibility-off' : 'visibility'}
                size={20}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorRow}>
              <MaterialIcons name="error" size={16} color={Colors.error} />
              <Text style={styles.errorText}>كلمة المرور غير صحيحة</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>دخول</Text>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59,130,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(59,130,246,0.3)',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    paddingHorizontal: Spacing.md,
    height: 56,
    gap: Spacing.sm,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputIcon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    textAlign: 'right',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
  },
  submitBtn: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  submitText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
