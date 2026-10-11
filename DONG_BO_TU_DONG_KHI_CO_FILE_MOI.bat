@echo off
chcp 65001 >nul
title 👁️ CANH CHUNG & DONG BO AUDIO MP3 TU DONG (FIREBASE)
echo ======================================================================
echo   DANG BAT CHE DO TU DONG CANH CHUNG THU MUC AUDIO...
echo   Moi khi ban bo file .mp3 vao thu muc audio, he thong se tu dong tai len!
echo ======================================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0dong-bo-audio.ps1" -Watch
echo.
pause
