// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSettings } from '@/hooks/useSettings';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [url, setUrl] = useState(settings.url);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage);
  const [settingsPassword, setSettingsPassword] = useState(settings.settingsPassword);
  const [bannerFontSize, setBannerFontSize] = useState(String(settings.bannerFontSize));
  const [bannerTextColor, setBannerTextColor] = useState(settings.bannerTextColor);
  const [themeColor, setThemeColor] = useState(settings.themeColor);
  const [marqueeSpeed, setMarqueeSpeed] = useState(String(settings.marqueeSpeed));
  const [isActive, setIsActive] = useState(settings.isActive);
  const [marqueeDirection, setMarqueeDirection] = useState(settings.marqueeDirection);
  const [broadcastText, setBroadcastText] = useState(settings.broadcastMessage?.text || '');
  const [broadcastActive, setBroadcastActive] = useState(settings.broadcastMessage?.isActive || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateSettings({
      url,
      welcomeMessage,
      settingsPassword,
      bannerFontSize: Number(bannerFontSize) || 18,
      bannerTextColor,
      themeColor,
      marqueeSpeed: Number(marqueeSpeed) || 15,
      isActive,
      marqueeDirection,
      broadcastMessage: { text: broadcastText, isActive: broadcastActive },
    });
    setSaving(false);
    Alert.alert('تم الحفظ', 'تم حفظ الإعدادات بنجاح');
  };

  const Section = ({ title, icon }: { title: string; icon: keyof typeof MaterialIcons.glyphMap }) => (
    <View style={styles.sectionHeader}>
      <MaterialIcons name={icon} size={18} color={Colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
    keyboardType,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    keyboardType?: any;
  }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        textAlign="right"
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>{saving ? 'جاري الحفظ...' : 'حفظ'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* App State */}
        <View style={styles.card}>
          <Section title="حالة التطبيق" icon="power-settings-new" />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>تفعيل التطبيق</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          {!isActive ? (
            <View style={styles.warningBadge}>
              <MaterialIcons name="warning" size={14} color={Colors.warning} />
              <Text style={styles.warningText}>سيظهر رسالة "التطبيق متوقف" للزوار</Text>
            </View>
          ) : null}
        </View>

        {/* URL Settings */}
        <View style={styles.card}>
          <Section title="إعدادات الرابط" icon="language" />
          <Field label="رابط الموقع" value={url} onChange={setUrl} placeholder="https://example.com" keyboardType="url" />
        </View>

        {/* Banner Settings */}
        <View style={styles.card}>
          <Section title="شريط الترحيب" icon="campaign" />
          <Field label="رسالة الترحيب" value={welcomeMessage} onChange={setWelcomeMessage} />
          <Field label="حجم الخط" value={bannerFontSize} onChange={setBannerFontSize} keyboardType="numeric" />
          <Field label="لون النص (HEX)" value={bannerTextColor} onChange={setBannerTextColor} placeholder="#ffffff" />
          <Field label="لون الشريط (HEX)" value={themeColor} onChange={setThemeColor} placeholder="#3b82f6" />
          <Field label="سرعة التمرير (1-30)" value={marqueeSpeed} onChange={setMarqueeSpeed} keyboardType="numeric" />

          {/* Direction Toggle */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>اتجاه التمرير</Text>
            <View style={styles.directionRow}>
              {(['rtl', 'ltr'] as const).map((dir) => (
                <TouchableOpacity
                  key={dir}
                  style={[styles.dirBtn, marqueeDirection === dir && styles.dirBtnActive]}
                  onPress={() => setMarqueeDirection(dir)}
                >
                  <Text style={[styles.dirBtnText, marqueeDirection === dir && styles.dirBtnTextActive]}>
                    {dir === 'rtl' ? 'يمين ← يسار' : 'يسار → يمين'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Broadcast Message */}
        <View style={styles.card}>
          <Section title="رسالة البث (Popup)" icon="notifications" />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>تفعيل الرسالة</Text>
            <Switch
              value={broadcastActive}
              onValueChange={setBroadcastActive}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          <Field label="نص الرسالة" value={broadcastText} onChange={setBroadcastText} placeholder="اكتب رسالة للزوار..." />
        </View>

        {/* Security */}
        <View style={styles.card}>
          <Section title="الأمان" icon="security" />
          <Field label="كلمة مرور الإعدادات" value={settingsPassword} onChange={setSettingsPassword} />
          <View style={styles.hintBadge}>
            <MaterialIcons name="info" size={14} color={Colors.primary} />
            <Text style={styles.hintText}>للوصول للإعدادات: مرر يدك يميناً ويساراً 5 مرات على شريط الترحيب</Text>
          </View>
        </View>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  saveBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'right',
  },
  fieldInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    paddingHorizontal: Spacing.md,
    height: 48,
    color: Colors.text,
    fontSize: FontSize.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  directionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dirBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  dirBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  dirBtnText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dirBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  warningText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    flex: 1,
    textAlign: 'right',
  },
  hintBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.15)',
  },
  hintText: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
    flex: 1,
    textAlign: 'right',
    lineHeight: 18,
  },
});
