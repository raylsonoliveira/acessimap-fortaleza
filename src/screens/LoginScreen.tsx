import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('raylsonsoaresdeoliveira@gmail.com');
  const [senha, setSenha] = useState('123456');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Password Recovery Modal State
  const [recoveryVisible, setRecoveryVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('raylsonsoaresdeoliveira@gmail.com');
  const [newRecoveryPass, setNewRecoveryPass] = useState('123456');
  const [recoveryFeedback, setRecoveryFeedback] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha para prosseguir.');
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      await login(email, senha);
      onLoginSuccess();
    } catch (e: any) {
      setErro(e.message || 'Falha ao autenticar.');
    } finally {
      setCarregando(false);
    }
  }

  async function handlePasswordReset() {
    setRecoveryError(null);
    setRecoveryFeedback(null);
    if (!recoveryEmail.trim()) {
      setRecoveryError('Informe seu e-mail cadastrado.');
      return;
    }
    if (newRecoveryPass.trim().length < 6) {
      setRecoveryError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setRecoveryLoading(true);
    try {
      const msg = await resetPassword(recoveryEmail, newRecoveryPass);
      setRecoveryFeedback(msg);
      setEmail(recoveryEmail.trim());
      setSenha(newRecoveryPass.trim());
    } catch (e: any) {
      setRecoveryError(e.message || 'Não foi possível redefinir a senha.');
    } finally {
      setRecoveryLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logotipo Central Figma */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>♿</Text>
          </View>
          <Text style={styles.appName}>AcessiMap</Text>
          <Text style={styles.appCity}>Fortaleza</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          <Input
            label="E-mail ou usuário"
            icon="✉️"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="seu.email@exemplo.com"
          />

          <Input
            label="Senha"
            icon="🔒"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Sua senha de acesso"
          />

          {erro ? <Text style={styles.errorBanner}>{erro}</Text> : null}

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={carregando}
            style={styles.loginBtn}
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => {
              setRecoveryEmail(email || 'raylsonsoaresdeoliveira@gmail.com');
              setRecoveryError(null);
              setRecoveryFeedback(null);
              setRecoveryVisible(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Recuperar senha esquecida"
          >
            <Text style={styles.forgotText}>🔑 Esqueceu sua senha? Recuperar acesso</Text>
          </TouchableOpacity>

          <Button
            title="Criar uma conta"
            variant="outline"
            onPress={onNavigateToRegister}
            style={styles.createAccountBtn}
          />
        </View>

        {/* Modal de Recuperação de Senha (Password Recovery) */}
        <Modal
          visible={recoveryVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setRecoveryVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>🔑 Recuperação de Senha</Text>
              <Text style={styles.modalSubtitle}>
                Informe seu e-mail cadastrado e defina uma nova senha (ou receba o link via Firebase Auth).
              </Text>

              <Input
                label="E-mail da conta"
                icon="✉️"
                value={recoveryEmail}
                onChangeText={setRecoveryEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="seu.email@exemplo.com"
              />

              <Input
                label="Nova Senha (mín. 6 caracteres)"
                icon="🔒"
                value={newRecoveryPass}
                onChangeText={setNewRecoveryPass}
                secureTextEntry
                placeholder="Nova senha de acesso"
              />

              {recoveryError ? <Text style={styles.errorBanner}>{recoveryError}</Text> : null}
              {recoveryFeedback ? <Text style={styles.successBanner}>{recoveryFeedback}</Text> : null}

              <Button
                title="Redefinir Senha Agora"
                onPress={handlePasswordReset}
                loading={recoveryLoading}
                style={styles.loginBtn}
              />

              <Button
                title="Voltar para o Login"
                variant="outline"
                onPress={() => setRecoveryVisible(false)}
                style={styles.createAccountBtn}
              />
            </View>
          </View>
        </Modal>

        {/* Tag inferior "Locais" do Figma */}
        <View style={styles.bottomPillContainer}>
          <View style={styles.bottomPill}>
            <Text style={styles.bottomPillText}>Locais Acessíveis</Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  logoIcon: {
    fontSize: 38,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  appCity: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formSection: {
    width: '100%',
  },
  loginBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  forgotBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  forgotText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  createAccountBtn: {
    marginTop: SPACING.xs,
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
  successBanner: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.xs,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  bottomPillContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  bottomPill: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  bottomPillText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
});
