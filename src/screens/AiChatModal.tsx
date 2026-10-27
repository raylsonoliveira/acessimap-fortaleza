import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { useData } from '../context/DataContext';
import { GeminiService } from '../services/geminiService';

interface AiChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({ visible, onClose }) => {
  const { mensagensChat, adicionarMensagemChat } = useData();
  const [inputMsg, setInputMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  const sugestoesRapidas = [
    'Quais praias têm acessibilidade em Fortaleza?',
    'O que diz a NBR 9050 sobre rampas?',
    'Como está a acessibilidade no Campus UNIFOR?',
    'Como reportar calçada quebrada?',
  ];

  async function handleEnviar(textoEnvio?: string) {
    const texto = textoEnvio || inputMsg;
    if (!texto.trim()) return;

    const novaUserMsg = {
      id: 'msg-' + Date.now(),
      remetente: 'usuario' as const,
      texto,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    adicionarMensagemChat(novaUserMsg);
    setInputMsg('');
    setEnviando(true);

    try {
      const respostaIA = await GeminiService.responderChat(texto);
      adicionarMensagemChat({
        id: 'msg-' + (Date.now() + 1),
        remetente: 'ia' as const,
        texto: respostaIA,
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (e) {
      adicionarMensagemChat({
        id: 'msg-' + (Date.now() + 1),
        remetente: 'ia' as const,
        texto: 'Desculpe, ocorreu uma instabilidade ao consultar o serviço. Tente novamente em instantes.',
        horario: 'Agora',
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header do Chat */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Assistente AcessiMap</Text>
            <Text style={styles.headerSubtitle}>Powered by Google Gemini AI</Text>
          </View>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>ONLINE</Text>
          </View>
        </View>

        {/* Mensagens */}
        <ScrollView contentContainerStyle={styles.messagesContainer} keyboardShouldPersistTaps="handled">
          {mensagensChat.map(msg => {
            const isUser = msg.remetente === 'usuario';
            return (
              <View
                key={msg.id}
                style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowIA]}
              >
                {!isUser ? <Text style={styles.avatarIA}>🤖</Text> : null}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleIA]}>
                  <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextIA]}>
                    {msg.texto}
                  </Text>
                  <Text style={[styles.timeText, isUser ? styles.timeUser : styles.timeIA]}>
                    {msg.horario}
                  </Text>
                </View>
              </View>
            );
          })}

          {enviando ? (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color={COLORS.chatBlue} />
              <Text style={styles.typingText}>Gemini está redigindo a resposta...</Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Sugestões Rápidas */}
        <View style={styles.quickQuestions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
            {sugestoesRapidas.map((sug, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickPill}
                onPress={() => handleEnviar(sug)}
              >
                <Text style={styles.quickPillText}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Barra de Entrada */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputField}
            placeholder="Tire dúvidas sobre acessibilidade..."
            placeholderTextColor={COLORS.textMuted}
            value={inputMsg}
            onChangeText={setInputMsg}
            onSubmitEditing={() => handleEnviar()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputMsg.trim() && { opacity: 0.5 }]}
            onPress={() => handleEnviar()}
            disabled={!inputMsg.trim() || enviando}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 60,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  closeIcon: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
  },
  aiBadge: {
    backgroundColor: '#065F46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  aiBadgeText: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '800',
  },
  messagesContainer: {
    padding: SPACING.md,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowIA: {
    justifyContent: 'flex-start',
  },
  avatarIA: {
    fontSize: 20,
    marginRight: 6,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: RADIUS.lg,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  bubbleIA: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: COLORS.textWhite,
  },
  bubbleTextIA: {
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: '#A7F3D0',
  },
  timeIA: {
    color: COLORS.textMuted,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  typingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  quickQuestions: {
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quickPill: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickPillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputField: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    height: 42,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendIcon: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '900',
  },
});
