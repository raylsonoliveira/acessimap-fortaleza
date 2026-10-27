import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSecondary = variant === 'secondary';

  let backgroundColor = COLORS.primary;
  let textColor = COLORS.textWhite;
  let borderColor = 'transparent';

  if (isOutline) {
    backgroundColor = 'transparent';
    textColor = COLORS.primary;
    borderColor = COLORS.primary;
  } else if (isDanger) {
    backgroundColor = COLORS.inaccessible;
  } else if (isSecondary) {
    backgroundColor = COLORS.surfaceAlt;
    textColor = COLORS.textPrimary;
    borderColor = COLORS.border;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth: isOutline || isSecondary ? 1.5 : 0,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon ? <Text style={[styles.icon, { color: textColor }]}>{icon}</Text> : null}
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
    fontSize: 18,
  },
});
