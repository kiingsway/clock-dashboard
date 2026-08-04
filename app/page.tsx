"use client"
import { useAppSettings } from '@/hooks/useAppSettings';
import '../i18n/i18n';
import { useState } from 'react';
import { TABS, TTabs } from '@/constants/tabs';
import classNames from 'classnames';
import styles from './App.module.scss';

export default function Home() {
  const appSettings = useAppSettings();
  const [tab] = useState<TTabs>('weather');

  const Component = TABS[tab].component;

  return (
    <div className={classNames(styles.root, 'root')}>
      <Component appSettings={appSettings} />
    </div>
  );
}
