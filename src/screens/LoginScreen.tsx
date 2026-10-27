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

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('raylsonsoaresdeoliveira@gmail.com');
  const [senha, setSenha] = useState('123456');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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
            onPress={() => alert('Recuperação de senha: Um link de redefinição seria enviado ao seu e-mail cadastrado.')}
            accessibilityRole="button"
          >
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <Button
            title="Criar uma conta"
            variant="outline"
            onPress={onNavigateToRegister}
            style={styles.createAccountBtn}
          />
        </View>

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
