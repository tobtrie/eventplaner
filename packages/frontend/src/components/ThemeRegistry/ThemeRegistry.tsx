'use client';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import theme from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import de from 'date-fns/locale/de';
import enGB from 'date-fns/locale/en-GB';

const locales: Record<string, unknown> = {
  'en-us': undefined,
  'en-gb': enGB,
  de: de,
};

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = React.useState<Locale['code']>('en-us');

  React.useEffect(() => {
    if (navigator) {
      setLocale(navigator.language.toLocaleLowerCase());
    }
  }, []);
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locales[locale ?? 'en-us']}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
