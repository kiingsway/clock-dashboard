"use client";
import '../i18n/i18n';
import { useState } from 'react';
import { TABS, TTabs } from '@/constants/tabs';
import classNames from 'classnames';
import styles from './App.module.scss';
import { NowProvider } from '@/contexts/NowContext';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';

export default function Home() {
  const [tab] = useState<TTabs>('weather');

  const Component = TABS[tab].component;

  return (
    <div className={classNames(styles.root, 'root')}>
      <AppSettingsProvider>
        <NowProvider>
          <Component />
        </NowProvider>
      </AppSettingsProvider>
    </div>
  );
}