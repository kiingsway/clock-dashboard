"use client";
import '../i18n/i18n';
import { useState } from 'react';
import { TABS } from '@/constants/tabs';
import classNames from 'classnames';
import styles from './App.module.scss';
import { NowProvider } from '@/contexts/NowContext';
import useAppSettings, { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { TTabs } from '@/types/app.types';

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

  const Component = TABS[tab].component;

  if (!isLoaded) return null;

  return (
    <NowProvider>
      <Component />
    </NowProvider>
  );
}