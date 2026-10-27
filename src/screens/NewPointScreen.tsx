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
import { Input } from '../components/Input';
import { CategoriaPonto, StatusAcessibilidade, SugestaoIA } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GeminiService } from '../services/geminiService';
import { AiAnalysisModal } from './AiAnalysisModal';

interface NewPointScreenProps {
  onBack: () => void;
  onSaved: () => void;
}

export const NewPointScreen: React.FC<NewPointScreenProps> = ({ onBack, onSaved }) => {
  const { adicionarPonto } = useData();
  const { user } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaPonto>('rampa');
  const [endereco, setEndereco] = useState('Av. Washington Soares, Fortaleza - CE');
  const [estado, setEstado] = useState<StatusAcessibilidade>('acessivel');
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [fotoAnexada, setFotoAnexada] = useState(false);

  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [sugestaoIA, setSugestaoIA] = useState<SugestaoIA | null>(null);
  const [modalIAVisible, setModalIAVisible] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const categoriasList: { key: CategoriaPonto; label: string; icon: string }[] = [
    { key: 'rampa', label: 'Rampa', icon: '📐' },
    { key: 'calcada', label: 'Calçada', icon: '🚶' },
    { key: 'acesso', label: 'Acesso', icon: '🚪' },
    { key: 'predio', label: 'Prédio Público', icon: '🏛️' },
    { key: 'outro', label: 'Outro', icon: '📍' },
  ];

  const estadosList: { key: StatusAcessibilidade; label: string; color: string }[] = [
    { key: 'acessivel', label: 'Acessível', color: COLORS.accessible },
    { key: 'parcial', label: 'Parcial', color: COLORS.partial },
    { key: 'inacessivel', label: 'Inacessível', color: COLORS.inaccessible },
  ];

  async function handleAnalisarComIA() {
    if (!comentario.trim() && !titulo.trim()) {
      Alert.alert(
        'Descrição necessária',
        'Por favor, escreva algo no campo de comentário ou título descrevendo o local para o Gemini analisar.'
      );
      return;
    }

    setAnalisandoIA(true);
    try {
      const textoParaAnalise = `${titulo} - ${comentario}`;
      const resultado = await GeminiService.analisarRelato(textoParaAnalise);
      setSugestaoIA(resultado);
      setModalIAVisible(true);
    } catch (e) {
      Alert.alert('Erro na IA', 'Não foi possível concluir a análise.');
    } finally {
      setAnalisandoIA(false);
    }
  }

  function handleConfirmarIA(sugestao: SugestaoIA) {
    if (sugestao.categoriaSugerida in { rampa: 1, calcada: 1, acesso: 1, predio: 1, outro: 1 }) {
      setCategoria(sugestao.categoriaSugerida as CategoriaPonto);
    }
    setEstado(sugestao.classificacaoSugerida);
    setModalIAVisible(false);
    Alert.alert('Sugestão Aplicada!', 'Os campos foram atualizados com a análise técnica do Gemini.');
  }

  async function handleSalvar() {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Informe um nome ou título para o ponto.');
      return;
    }

    setSalvando(true);
    try {
      await adicionarPonto({
        titulo,
        categoria,
        endereco,
        latitude: -3.7319,
        longitude: -38.5267,
        estado,
        nota,
        comentario: comentario || 'Cadastro colaborativo de acessibilidade.',
        recursos: [
          categoria === 'rampa' ? 'Rampa Padronizada' : 'Piso Tátil',
          estado === 'acessivel' ? 'Livre de Barreiras' : 'Atenção ao Piso',
        ],
        criadoPor: user?.nome || 'Usuário Colaborador',
      });
      Alert.alert('Sucesso!', 'Ponto cadastrado com sucesso no AcessiMap Fortaleza.');
      onSaved();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o ponto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar / Avaliar Ponto</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Título */}
        <Input
          label="Nome do Local ou Ponto"
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: Rampa de acesso ao Bloco B"
        />

        {/* Tipo / Categoria */}
        <Text style={styles.sectionTitle}>Tipo de Infraestrutura</Text>
        <View style={styles.typeGrid}>
          {categoriasList.map(item => {
            const active = categoria === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.typeButton, active && styles.typeButtonActive]}
                onPress={() => setCategoria(item.key)}
              >
                <Text style={styles.typeIcon}>{item.icon}</Text>
                <Text style={[styles.typeText, active && styles.typeTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Localização */}
        <Input
          label="Localização / Endereço"
          icon="📍"
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Endereço em Fortaleza"
        />

        {/* Estado de Acessibilidade */}
        <Text style={styles.sectionTitle}>Estado de Acessibilidade</Text>
        <View style={styles.statusRow}>
          {estadosList.map(st => {
            const active = estado === st.key;
            return (
              <TouchableOpacity
                key={st.key}
                style={[
                  styles.statusButton,
                  active && { backgroundColor: st.color, borderColor: st.color },
                ]}
                onPress={() => setEstado(st.key)}
              >
                <Text style={[styles.statusText, active && { color: COLORS.textWhite, fontWeight: '700' }]}>
                  {st.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nota / Classificação */}
        <Text style={styles.sectionTitle}>Nota de Avaliação ({nota} de 5)</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setNota(star)} style={styles.starBtn}>
              <Text style={[styles.starText, star <= nota && styles.starActive]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Anexar Foto */}
        <Text style={styles.sectionTitle}>Foto do Local</Text>
        <TouchableOpacity
          style={[styles.photoBox, fotoAnexada && styles.photoBoxAttached]}
          onPress={() => setFotoAnexada(!fotoAnexada)}
        >
          <Text style={styles.photoIcon}>{fotoAnexada ? '✅' : '📷'}</Text>
          <Text style={styles.photoText}>
            {fotoAnexada ? 'Fotografia anexada com sucesso!' : 'Tirar foto ou anexar da galeria'}
          </Text>
        </TouchableOpacity>

        {/* Comentário */}
        <Text style={styles.sectionTitle}>Comentário e Descrição Técnica</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          value={comentario}
          onChangeText={setComentario}
          placeholder="Descreva detalhes como largura da rampa, piso tátil, inclinação, conservação..."
          placeholderTextColor={COLORS.textMuted}
        />

        {/* Botão Auxílio por IA (Gemini) do Figma */}
        <Button
          title={analisandoIA ? 'Consultando Gemini...' : '✨ Auxílio por IA (Gemini)'}
          variant="secondary"
          onPress={handleAnalisarComIA}
          loading={analisandoIA}
          style={styles.aiButton}
          textStyle={{ color: '#4338CA', fontWeight: '700' }}
        />

        {/* Botão Salvar */}
        <Button
          title="Salvar Ponto"
          onPress={handleSalvar}
          loading={salvando}
          style={styles.saveBtn}
        />
      </ScrollView>

      {/* Modal Tela 5 do Figma */}
      <AiAnalysisModal
        visible={modalIAVisible}
        sugestao={sugestaoIA}
        onConfirm={handleConfirmarIA}
        onEdit={() => setModalIAVisible(false)}
        onClose={() => setModalIAVisible(false)}
      />
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  typeIcon: {
    marginRight: 6,
    fontSize: 16,
  },
  typeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  typeTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starBtn: {
    padding: 4,
  },
  starText: {
    fontSize: 32,
    color: '#D1D5DB',
  },
  starActive: {
    color: '#F59E0B',
  },
  photoBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceAlt,
  },
  photoBoxAttached: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  photoIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  photoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  commentInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  aiButton: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1.5,
    marginTop: SPACING.lg,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
});
