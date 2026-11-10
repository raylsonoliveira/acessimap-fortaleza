@echo off
chcp 65001 >nul
title AcessiMap Fortaleza - Servidor Expo
echo ==========================================================
echo    ACESSIMAP FORTALEZA - INICIANDO APLICATIVO...
echo ==========================================================
echo.
echo 1. Aguarde o QR Code aparecer abaixo.
echo 2. Abra o aplicativo "Expo Go" no seu celular e escaneie o QR Code.
echo.
cd /d "C:\Users\rayls\.gemini\antigravity\scratch\acessimap-fortaleza"
npx expo start
pause
