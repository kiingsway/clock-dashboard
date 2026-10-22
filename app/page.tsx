"use client";
import '../i18n/i18n';
import { useState } from 'react';
import { TABS } from '@/constants/tabs';
import classNames from 'classnames';
import styles from './App.module.scss';
import { NowProvider } from '@/contexts/NowContext';
import useAppSettings, { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { TTabs } from '@/types/app.types';
import { useTranslation } from 'react-i18next';
import preloadInitialData from '@/services/preloadInitialData';

// Começa a buscar clima, AQI e alertas junto com o carregamento das traduções,
// antes do primeiro render. No servidor não faz nada.
preloadInitialData();

export default function Home() {

  return (
    <div className={classNames(styles.root, 'root')}>
      <AppSettingsProvider>
        <HomeContent />
      </AppSettingsProvider>
    </div>
  );
}

function HomeContent() {
  const [tab] = useState<TTabs>('weather');

  const { isLoaded } = useAppSettings();
  const { ready: translationsReady } = useTranslation();

  const Component = TABS[tab].component;

  if (!isLoaded || !translationsReady) return null;

  return (
    <NowProvider>
      <Component />
    </NowProvider>
  );
}