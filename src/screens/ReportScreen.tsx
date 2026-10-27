import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { Button } from '../components/Button';
import { TipoOcorrencia } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface ReportScreenProps {
  onBack: () => void;
  onSubmitted: () => void;
  initialAddress?: string;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  onBack,
  onSubmitted,
  initialAddress = 'Fortaleza - CE',
}) => {
  const { adicionarOcorrencia } = useData();
  const { user } = useAuth();

  const [tipo, setTipo] = useState<TipoOcorrencia>('rampa');
  const [endereco, setEndereco] = useState(initialAddress);
  const [descricao, setDescricao] = useState('');
  const [fotoAnexada, setFotoAnexada] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const tiposOcorrencia: { key: TipoOcorrencia; label: string; icon: string }[] = [
    { key: 'rampa', label: 'Rampa', icon: '📐' },
    { key: 'calcada', label: 'Calçada', icon: '🚶' },
    { key: 'predio', label: 'Prédio Público', icon: '🏛️' },
    { key: 'outro', label: 'Outro', icon: '📍' },
  ];

  async function handleEnviar() {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Por favor, descreva o que aconteceu no local.');
      return;
    }

    setEnviando(true);
    try {
      await adicionarOcorrencia({
        tipo,
        endereco,
        descricao,
        status: 'pendente',
        criadoPor: user?.nome || 'Usuário Anônimo',
      });
      Alert.alert(
        'Ocorrência Registrada!',
        'Sua contribuição foi enviada e ajudará pedestres a evitarem esta barreira urbana em Fortaleza.'
      );
      onSubmitted();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível registrar a ocorrência.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header do Figma */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Ponto</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Tipo de Ocorrência */}
        <Text style={styles.sectionLabel}>Tipo de ocorrência</Text>
        <View style={styles.optionsList}>
          {tiposOcorrencia.map(item => {
            const isSelected = tipo === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                onPress={() => setTipo(item.key)}
              >
                <Text style={styles.optionIcon}>{item.icon}</Text>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Localização */}
        <Text style={styles.sectionLabel}>Localização</Text>
        <TextInput
          style={styles.inputAddress}
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Endereço ou referência em Fortaleza"
          placeholderTextColor={COLORS.textMuted}
        />

        {/* Foto do Local */}
        <Text style={styles.sectionLabel}>Foto do local</Text>
        <TouchableOpacity
          style={[styles.photoBox, fotoAnexada && styles.photoBoxAttached]}
          onPress={() => setFotoAnexada(!fotoAnexada)}
        >
          <Text style={styles.cameraIcon}>{fotoAnexada ? '✅' : '📷'}</Text>
          <Text style={styles.photoBoxText}>
            {fotoAnexada ? 'Fotografia anexada' : 'Tirar foto ou anexar'}
          </Text>
        </TouchableOpacity>

        {/* Comentário (opcional) */}
        <Text style={styles.sectionLabel}>Comentário (opcional)</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva o que aconteceu..."
          placeholderTextColor={COLORS.textMuted}
        />

        {/* Botão Enviar do Figma */}
        <Button
          title="Enviar"
          onPress={handleEnviar}
          loading={enviando}
          style={styles.submitBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs + 2,
  },
  optionsList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  inputAddress: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 46,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  photoBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#99F6E4',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
  },
  photoBoxAttached: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  cameraIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  photoBoxText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '600',
  },
  commentInput: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
});
