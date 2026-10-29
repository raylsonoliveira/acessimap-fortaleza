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
import { CategoriaPonto, PontoAcessibilidade, StatusAcessibilidade, SugestaoIA } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GeminiService } from '../services/geminiService';
import { AiAnalysisModal } from './AiAnalysisModal';

interface NewPointScreenProps {
  onBack: () => void;
  onSaved: (updated?: PontoAcessibilidade) => void;
  pointToEdit?: PontoAcessibilidade | null;
}

const REGIOES_FORTALEZA = [
  { label: 'Edson Queiroz / UNIFOR', lat: -3.7699, lng: -38.4778, end: 'Av. Washington Soares - Edson Queiroz, Fortaleza - CE' },
  { label: 'Beira-Mar / Meireles', lat: -3.7258, lng: -38.4984, end: 'Av. Beira Mar - Meireles, Fortaleza - CE' },
  { label: 'Centro / Pça do Ferreira', lat: -3.7275, lng: -38.5283, end: 'Rua Floriano Peixoto - Centro, Fortaleza - CE' },
  { label: 'Praia de Iracema / Dragão', lat: -3.7217, lng: -38.5202, end: 'R. Dragão do Mar - Praia de Iracema, Fortaleza - CE' },
  { label: 'Aldeota / Santos Dumont', lat: -3.7342, lng: -38.5029, end: 'Av. Santos Dumont - Aldeota, Fortaleza - CE' },
  { label: 'Benfica / Av. 13 de Maio', lat: -3.7441, lng: -38.5369, end: 'Av. Treze de Maio - Benfica, Fortaleza - CE' },
  { label: 'Cocó / Parque Ecológico', lat: -3.7455, lng: -38.4856, end: 'Av. Padre Antônio Tomás - Cocó, Fortaleza - CE' },
];

const FOTOS_EXEMPLO = [
  { label: 'Rampa Acessível NBR 9050', url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&q=80' },
  { label: 'Calçada com Piso Tátil', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80' },
  { label: 'Acesso a Prédio Público', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
];

export const NewPointScreen: React.FC<NewPointScreenProps> = ({
  onBack,
  onSaved,
  pointToEdit = null,
}) => {
  const { adicionarPonto, editarPonto } = useData();
  const { user } = useAuth();
  const isEditing = Boolean(pointToEdit);

  const [titulo, setTitulo] = useState(pointToEdit?.titulo || '');
  const [categoria, setCategoria] = useState<CategoriaPonto>(pointToEdit?.categoria || 'rampa');
  const [endereco, setEndereco] = useState(
    pointToEdit?.endereco || 'Av. Washington Soares, Fortaleza - CE'
  );
  const [latitude, setLatitude] = useState(
    pointToEdit ? String(pointToEdit.latitude) : '-3.7520'
  );
  const [longitude, setLongitude] = useState(
    pointToEdit ? String(pointToEdit.longitude) : '-38.4950'
  );
  const [estado, setEstado] = useState<StatusAcessibilidade>(pointToEdit?.estado || 'acessivel');
  const [nota, setNota] = useState(pointToEdit ? Math.round(pointToEdit.nota) : 5);
  const [comentario, setComentario] = useState(pointToEdit?.comentario || '');
  const [fotoUrl, setFotoUrl] = useState<string>(pointToEdit?.fotoUrl || '');
  const [mostrarSeletorFoto, setMostrarSeletorFoto] = useState(false);

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

  function handleSelecionarRegiao(reg: typeof REGIOES_FORTALEZA[0]) {
    setEndereco(reg.end);
    // Pequeno deslocamento para evitar sobreposição exata de novos pinos
    const offsetLat = (Math.random() - 0.5) * 0.004;
    const offsetLng = (Math.random() - 0.5) * 0.004;
    setLatitude((reg.lat + offsetLat).toFixed(4));
    setLongitude((reg.lng + offsetLng).toFixed(4));
  }

  async function handleAnalisarComIA() {
    if (!comentario.trim() && !titulo.trim()) {
      Alert.alert(
        'Descrição necessária',
        'Por favor, escreva algo no campo de comentário ou título descrevendo o local para análise.'
      );
      return;
    }

    setAnalisandoIA(true);
    try {
      const textoParaAnalise = `${titulo} - ${comentario}`;
      const resultado = await GeminiService.analisarRelato(textoParaAnalise);
      setSugestaoIA(resultado);
      setModalIAVisible(true);
    } catch {
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
    Alert.alert('Sugestão Aplicada!', 'Os campos foram preenchidos com a classificação sugerida.');
  }

  async function handleSalvar() {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Informe um nome ou título para o ponto.');
      return;
    }

    const latNum = parseFloat(latitude) || -3.7319;
    const lngNum = parseFloat(longitude) || -38.5267;

    const recursosCalculados = [
      categoria === 'rampa' ? 'Rampa Padronizada' : 'Piso Tátil',
      estado === 'acessivel'
        ? 'Livre de Barreiras'
        : estado === 'parcial'
        ? 'Atenção ao Desnível'
        : 'Necessita Adequação NBR 9050',
    ];

    setSalvando(true);
    try {
      if (isEditing && pointToEdit) {
        const pontoAtualizado: PontoAcessibilidade = {
          ...pointToEdit,
          titulo: titulo.trim(),
          categoria,
          endereco: endereco.trim(),
          latitude: latNum,
          longitude: lngNum,
          estado,
          nota,
          comentario: comentario.trim() || 'Ponto atualizado pelo autor.',
          fotoUrl: fotoUrl.trim() || undefined,
          recursos: recursosCalculados,
        };
        await editarPonto(pontoAtualizado);
        Alert.alert('Ponto Atualizado!', 'As alterações foram salvas com sucesso (RF07 / RF16).');
        onSaved(pontoAtualizado);
      } else {
        await adicionarPonto({
          titulo: titulo.trim(),
          categoria,
          endereco: endereco.trim(),
          latitude: latNum,
          longitude: lngNum,
          estado,
          nota,
          comentario: comentario.trim() || 'Cadastro colaborativo de acessibilidade.',
          fotoUrl: fotoUrl.trim() || undefined,
          recursos: recursosCalculados,
          criadoPor: user?.nome || 'Usuário Colaborador',
          criadoPorId: user?.id,
        });
        Alert.alert('Sucesso!', 'Ponto cadastrado com sucesso no AcessiMap Fortaleza.');
        onSaved();
      }
    } catch {
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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Ponto (RF07)' : 'Cadastrar / Avaliar Ponto'}
        </Text>
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

        {/* Seletor Rápido de Região em Fortaleza */}
        <Text style={styles.sectionTitle}>Bairro / Região em Fortaleza</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionRow}
        >
          {REGIOES_FORTALEZA.map((reg, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.regionChip}
              onPress={() => handleSelecionarRegiao(reg)}
            >
              <Text style={styles.regionChipText}>📍 {reg.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Localização */}
        <Input
          label="Localização / Endereço"
          icon="📍"
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Endereço em Fortaleza"
        />

        {/* Coordenadas Geográficas (Latitude / Longitude) */}
        <View style={styles.coordsRow}>
          <View style={{ flex: 1 }}>
            <Input
              label="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
              placeholder="-3.7319"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
              placeholder="-38.5267"
            />
          </View>
        </View>

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

        {/* Anexar Foto (RF11) */}
        <Text style={styles.sectionTitle}>Foto do Local (RF11)</Text>
        <TouchableOpacity
          style={[styles.photoBox, Boolean(fotoUrl) && styles.photoBoxAttached]}
          onPress={() => setMostrarSeletorFoto(!mostrarSeletorFoto)}
        >
          {fotoUrl ? (
            <View style={styles.photoPreviewWrap}>
              <Image source={{ uri: fotoUrl }} style={styles.photoPreview} />
              <Text style={styles.photoText}>✅ Foto vinculada (toque para alterar ou remover)</Text>
            </View>
          ) : (
            <>
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoText}>Selecionar fotografia ou informar URL da imagem</Text>
            </>
          )}
        </TouchableOpacity>

        {mostrarSeletorFoto && (
          <View style={styles.photoSelectorPanel}>
            <Text style={styles.photoSelectorLabel}>Escolha uma imagem de registro ou cole a URL:</Text>
            <View style={styles.samplePhotosRow}>
              {FOTOS_EXEMPLO.map((f, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.samplePhotoBtn,
                    fotoUrl === f.url && styles.samplePhotoBtnActive,
                  ]}
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
                    🗑️ Remover foto
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <Input
              label="Ou informe a URL de uma foto"
              value={fotoUrl}
              onChangeText={setFotoUrl}
              placeholder="https://exemplo.com/foto-rampa.jpg"
            />
          </View>
        )}

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
          title={analisandoIA ? 'Consultando IA...' : '✨ Auxílio por IA (Gemini / NBR 9050)'}
          variant="secondary"
          onPress={handleAnalisarComIA}
          loading={analisandoIA}
          style={styles.aiButton}
          textStyle={{ color: '#4338CA', fontWeight: '700' }}
        />

        {/* Botão Salvar */}
        <Button
          title={isEditing ? 'Salvar Alterações' : 'Salvar Ponto'}
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
  regionRow: {
    gap: 8,
    paddingVertical: 4,
  },
  regionChip: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  regionChipText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 10,
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
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceAlt,
  },
  photoBoxAttached: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  photoPreviewWrap: {
    alignItems: 'center',
    width: '100%',
  },
  photoPreview: {
    width: '100%',
    height: 140,
    borderRadius: RADIUS.sm,
    marginBottom: 8,
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
  photoSelectorPanel: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoSelectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
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
  samplePhotoBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  samplePhotoText: {
    fontSize: 12,
    color: COLORS.textPrimary,
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
