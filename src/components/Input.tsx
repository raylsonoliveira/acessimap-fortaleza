import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  secureTextEntry,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <TextInput
          style={styles.textInput}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={isSecure}
          {...rest}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Ver senha'}
          >
            <Text style={styles.eyeText}>{isPasswordVisible ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs + 2,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  inputError: {
    borderColor: COLORS.inaccessible,
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  eyeText: {
    fontSize: 16,
  },
  errorText: {
    color: COLORS.inaccessible,
    fontSize: 12,
    marginTop: 4,
  },
});
