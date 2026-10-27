import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../theme';
import { StatusAcessibilidade } from '../types';

interface BadgeProps {
  status: StatusAcessibilidade | 'pendente' | 'em_analise' | 'resolvido';
  label?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, style }) => {
  let bg = COLORS.accessibleLight;
  let color = COLORS.accessible;
  let text = label || 'Acessível';

  switch (status) {
    case 'acessivel':
    case 'resolvido':
      bg = COLORS.accessibleLight;
      color = '#059669';
      text = label || (status === 'resolvido' ? 'Resolvido' : 'Totalmente Acessível');
      break;
    case 'parcial':
    case 'em_analise':
      bg = COLORS.partialLight;
      color = '#D97706';
      text = label || (status === 'em_analise' ? 'Em Análise' : 'Acessibilidade Parcial');
      break;
    case 'inacessivel':
    case 'pendente':
      bg = COLORS.inaccessibleLight;
      color = '#DC2626';
      text = label || (status === 'pendente' ? 'Pendente' : 'Inacessível / Alerta');
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
