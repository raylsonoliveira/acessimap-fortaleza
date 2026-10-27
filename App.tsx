import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DataProvider, useData } from './src/context/DataContext';
import { Header } from './src/components/Header';
import { BottomNav, TabKey } from './src/components/BottomNav';
import { COLORS } from './src/theme';
import { PontoAcessibilidade } from './src/types';

// Telas
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { MapScreen } from './src/screens/MapScreen';
import { NewPointScreen } from './src/screens/NewPointScreen';
import { PointDetailScreen } from './src/screens/PointDetailScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SafeRouteScreen } from './src/screens/SafeRouteScreen';
import { AiChatModal } from './src/screens/AiChatModal';

type ActiveView = 'tab' | 'new_point' | 'point_detail' | 'report_specific';

function MainApp() {
  const { user, loading } = useAuth();
  const [authFlow, setAuthFlow] = useState<'login' | 'register'>('login');

  // Estado de Navegação Principal
  const [currentTab, setCurrentTab] = useState<TabKey>('mapa');
  const [activeView, setActiveView] = useState<ActiveView>('tab');
  const [selectedPoint, setSelectedPoint] = useState<PontoAcessibilidade | null>(null);

  // Chat com IA
  const [chatModalVisible, setChatModalVisible] = useState(false);

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 1. Fluxo de Autenticação (Login / Cadastro)
  if (!user) {
    if (authFlow === 'register') {
      return (
        <RegisterScreen
          onBackToLogin={() => setAuthFlow('login')}
          onRegisterSuccess={() => setAuthFlow('login')}
        />
      );
    }
    return (
      <LoginScreen
        onNavigateToRegister={() => setAuthFlow('register')}
        onLoginSuccess={() => setCurrentTab('mapa')}
      />
    );
  }

  // 2. Fluxo Principal da Aplicação
  function renderContent() {
    // Telas em pilha (Stack)
    if (activeView === 'new_point') {
      return (
        <NewPointScreen
          onBack={() => setActiveView('tab')}
          onSaved={() => {
            setActiveView('tab');
            setCurrentTab('mapa');
          }}
        />
      );
    }

    if (activeView === 'point_detail' && selectedPoint) {
      return (
        <PointDetailScreen
          ponto={selectedPoint}
          onBack={() => setActiveView('tab')}
          onReportProblem={p => {
            setSelectedPoint(p);
            setActiveView('report_specific');
          }}
        />
      );
    }

    if (activeView === 'report_specific' && selectedPoint) {
      return (
        <ReportScreen
          initialAddress={selectedPoint.endereco}
          onBack={() => setActiveView('point_detail')}
          onSubmitted={() => {
            setActiveView('tab');
            setCurrentTab('mapa');
          }}
        />
      );
    }

    // Telas de Abas (Bottom Tabs)
    switch (currentTab) {
      case 'mapa':
        return (
          <MapScreen
            onSelectPonto={p => {
              setSelectedPoint(p);
              setActiveView('point_detail');
            }}
            onNavigateToNewPoint={() => setActiveView('new_point')}
          />
        );
      case 'reportar':
        return (
          <ReportScreen
            onBack={() => setCurrentTab('mapa')}
            onSubmitted={() => setCurrentTab('mapa')}
          />
        );
      case 'rotas':
        return <SafeRouteScreen onBack={() => setCurrentTab('mapa')} />;
      case 'perfil':
        return (
          <ProfileScreen
            onLogout={() => {}}
            onNavigateToRotas={() => setCurrentTab('rotas')}
          />
        );
      default:
        return null;
    }
  }

  return (
    <View style={styles.root}>
      {/* Header Superior com Chat de IA do Figma */}
      <Header
        onOpenChat={() => setChatModalVisible(true)}
        showBack={activeView !== 'tab'}
        onBack={() => setActiveView('tab')}
      />

      {/* Conteúdo da Tela */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Barra de Navegação Inferior (oculta em telas modais) */}
      {activeView === 'tab' && (
        <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
      )}

      {/* Modal de Chat com o Assistente Gemini */}
      <AiChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
      />

      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
