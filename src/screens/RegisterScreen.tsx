import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

interface RegisterScreenProps {
  onBackToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBackToLogin,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleRegister() {
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha os campos obrigatórios (nome, e-mail e senha).');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve possuir pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmaSenha) {
      setErro('A confirmação de senha não confere.');
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      await register(nome, email, telefone, senha);
      onRegisterSuccess();
    } catch (e: any) {
      setErro(e.message || 'Erro ao realizar cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top Bar com Botão Voltar do Figma */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBackToLogin}
          style={styles.backBtn}
          accessibilityLabel="Voltar para a tela de login"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar conta</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Junte-se à comunidade AcessiMap e contribua com a acessibilidade em Fortaleza.
        </Text>

        <View style={styles.formSection}>
          <Input
            label="Nome completo"
            icon="👤"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Raylson Oliveira"
          />

          <Input
            label="E-mail"
            icon="✉️"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="seu.email@exemplo.com"
          />

          <Input
            label="Telefone"
            icon="📞"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            placeholder="(85) 99999-9999"
          />

          <Input
            label="Senha"
            icon="🔒"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Crie uma senha segura"
          />

          <Input
            label="Confirmar senha"
            icon="🔒"
            value={confirmaSenha}
            onChangeText={setConfirmaSenha}
            secureTextEntry
            placeholder="Repita a senha digitada"
          />

          {erro ? <Text style={styles.errorBanner}>{erro}</Text> : null}

          <Button
            title="Cadastrar"
            onPress={handleRegister}
            loading={carregando}
            style={styles.registerBtn}
          />

          <TouchableOpacity
            style={styles.loginLinkWrap}
            onPress={onBackToLogin}
            accessibilityRole="button"
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta? <Text style={styles.loginLinkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  topBar: {
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  formSection: {
    width: '100%',
  },
  registerBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  loginLinkWrap: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  loginLinkText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  errorBanner: {
    color: COLORS.inaccessible,
    fontSize: 13,
    backgroundColor: COLORS.inaccessibleLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.xs,
    textAlign: 'center',
  },
});
