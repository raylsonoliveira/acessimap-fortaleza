import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Ocorrencia, StatusOcorrencia, TipoOcorrencia } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface ReportScreenProps {
  onBack: () => void;
  onSubmitted: () => void;
  initialAddress?: string;
  ocorrenciaToEdit?: Ocorrencia | null;
}

const FOTOS_OCORRENCIA_EXEMPLO = [
  { label: 'Calçada Obstruída', url: 'https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=600&q=80' },
  { label: 'Rampa Danificada', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80' },
];

export const ReportScreen: React.FC<ReportScreenProps> = ({
  onBack,
  onSubmitted,
  initialAddress = 'Fortaleza - CE',
  ocorrenciaToEdit = null,
}) => {
  const { adicionarOcorrencia, editarOcorrencia } = useData();
  const { user } = useAuth();
  const isEditing = Boolean(ocorrenciaToEdit);

  const [tipo, setTipo] = useState<TipoOcorrencia>(ocorrenciaToEdit?.tipo || 'rampa');
  const [endereco, setEndereco] = useState(ocorrenciaToEdit?.endereco || initialAddress);
  const [descricao, setDescricao] = useState(ocorrenciaToEdit?.descricao || '');
  const [status, setStatus] = useState<StatusOcorrencia>(ocorrenciaToEdit?.status || 'pendente');
  const [fotoUrl, setFotoUrl] = useState<string>(ocorrenciaToEdit?.fotoUrl || '');
  const [mostrarSeletorFoto, setMostrarSeletorFoto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const tiposOcorrencia: { key: TipoOcorrencia; label: string; icon: string }[] = [
    { key: 'rampa', label: 'Rampa', icon: '📐' },
    { key: 'calcada', label: 'Calçada', icon: '🚶' },
    { key: 'predio', label: 'Prédio Público', icon: '🏛️' },
    { key: 'outro', label: 'Outro', icon: '📍' },
  ];

  const statusList: { key: StatusOcorrencia; label: string }[] = [
    { key: 'pendente', label: 'Pendente' },
    { key: 'em_analise', label: 'Em Análise' },
    { key: 'resolvido', label: 'Resolvido' },
  ];

  async function handleEnviar() {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Por favor, descreva o que aconteceu no local.');
      return;
    }

    setEnviando(true);
    try {
      if (isEditing && ocorrenciaToEdit) {
        const atualizada: Ocorrencia = {
          ...ocorrenciaToEdit,
          tipo,
          endereco: endereco.trim(),
          descricao: descricao.trim(),
          status,
          fotoUrl: fotoUrl.trim() || undefined,
        };
        await editarOcorrencia(atualizada);
        Alert.alert('Ocorrência Atualizada!', 'O registro de ocorrência foi atualizado com sucesso (RF17).');
      } else {
        await adicionarOcorrencia({
          tipo,
          endereco: endereco.trim(),
          descricao: descricao.trim(),
          status: 'pendente',
          fotoUrl: fotoUrl.trim() || undefined,
          criadoPor: user?.nome || 'Usuário Colaborador',
          criadoPorId: user?.id,
        });
        Alert.alert(
          'Ocorrência Registrada!',
          'Sua contribuição foi enviada e ajudará pedestres a evitarem esta barreira urbana em Fortaleza.'
        );
      }
      onSubmitted();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a ocorrência.');
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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Ocorrência (RF17)' : 'Reportar Ponto / Ocorrência'}
        </Text>
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

        {/* Status da Ocorrência (visível na edição - RF17) */}
        {isEditing && (
          <>
            <Text style={styles.sectionLabel}>Status da Ocorrência</Text>
            <View style={styles.statusRow}>
              {statusList.map(st => {
                const active = status === st.key;
                return (
                  <TouchableOpacity
                    key={st.key}
                    style={[styles.statusBtn, active && styles.statusBtnActive]}
                    onPress={() => setStatus(st.key)}
                  >
                    <Text style={[styles.statusBtnText, active && styles.statusBtnTextActive]}>
                      {st.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Localização */}
        <Text style={styles.sectionLabel}>Localização</Text>
        <TextInput
          style={styles.inputAddress}
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Endereço ou referência em Fortaleza"
          placeholderTextColor={COLORS.textMuted}
        />

        {/* Foto do Local (RF11) */}
        <Text style={styles.sectionLabel}>Foto do local (RF11)</Text>
        <TouchableOpacity
          style={[styles.photoBox, Boolean(fotoUrl) && styles.photoBoxAttached]}
          onPress={() => setMostrarSeletorFoto(!mostrarSeletorFoto)}
        >
          {fotoUrl ? (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Image source={{ uri: fotoUrl }} style={styles.photoPreview} />
              <Text style={styles.photoBoxText}>✅ Fotografia anexada (toque para alterar)</Text>
            </View>
          ) : (
            <>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.photoBoxText}>Tirar foto ou anexar da galeria</Text>
            </>
          )}
        </TouchableOpacity>

        {mostrarSeletorFoto && (
          <View style={styles.photoSelectorPanel}>
            <View style={styles.samplePhotosRow}>
              {FOTOS_OCORRENCIA_EXEMPLO.map((f, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.samplePhotoBtn}
                  onPress={() => {
                    setFotoUrl(f.url);
                    setMostrarSeletorFoto(false);
                  }}
                >
                  <Text style={styles.samplePhotoText}>🖼️ {f.label}</Text>
                </TouchableOpacity>
              ))}
              {fotoUrl ? (
                <TouchableOpacity
                  style={[styles.samplePhotoBtn, { borderColor: COLORS.inaccessible }]}
                  onPress={() => {
                    setFotoUrl('');
                    setMostrarSeletorFoto(false);
                  }}
                >
                  <Text style={[styles.samplePhotoText, { color: COLORS.inaccessible }]}>
                    🗑️ Remover
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <Input
              label="URL da fotografia"
              value={fotoUrl}
              onChangeText={setFotoUrl}
              placeholder="https://exemplo.com/foto-ocorrencia.jpg"
            />
          </View>
        )}

        {/* Comentário / Descrição */}
        <Text style={styles.sectionLabel}>Descrição da Ocorrência</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva o que aconteceu (ex: calçada obstruída, rampa quebrada)..."
          placeholderTextColor={COLORS.textMuted}
        />

        {/* Botão Enviar do Figma */}
        <Button
          title={isEditing ? 'Salvar Alterações' : 'Enviar'}
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
    fontSize: 17,
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
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  statusBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statusBtnTextActive: {
    color: COLORS.textWhite,
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
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
  },
  photoBoxAttached: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  photoPreview: {
    width: '100%',
    height: 130,
    borderRadius: RADIUS.sm,
    marginBottom: 8,
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
  photoSelectorPanel: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  samplePhotosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  samplePhotoBtn: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  samplePhotoText: {
    fontSize: 12,
    color: COLORS.textPrimary,
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
