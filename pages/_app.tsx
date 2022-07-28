import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR, { SWRConfig } from 'swr';

import { lightTheme } from '../themes';
import { UiProvider } from '../context/ui/UiProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        // refreshInterval: 500,
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}
    >
      <UiProvider>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </UiProvider>
    </SWRConfig>
  );
}

export default MyApp;
