/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// i18n
import 'src/locales/i18n';
import { io } from 'socket.io-client';

// ----------------------------------------------------------------------

import Router from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';
import { LocalizationProvider } from 'src/locales';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { AuthProvider } from 'src/auth/context/jwt';
// import { AuthProvider } from 'src/auth/context/auth0';
// import { AuthProvider } from 'src/auth/context/amplify';
// import { AuthProvider } from 'src/auth/context/firebase';
// import { AuthProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export default function App() {
  const charAt = `

  ░░░    ░░░
  ▒▒▒▒  ▒▒▒▒
  ▒▒ ▒▒▒▒ ▒▒
  ▓▓  ▓▓  ▓▓
  ██      ██

  `;

  console.info(`%c${charAt}`, 'color: #5BE49B');
  const socket = io('http://localhost:8080'); // Replace with your server URL

  // Example: Listen for a backend-initiated message
  socket.on('backend_message', (data) => {
    console.log('Message from backend:', data);
  });
  
  // Example: Listen for broadcasted messages
  socket.on('receive_message', (data) => {
    console.log('Broadcasted message:', data);
  });
  
  // Optionally, send a message to the backend
  socket.emit('send_message', 'Hello from the frontend!');

  useScrollToTop();

  return (
    <AuthProvider>
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <CheckoutProvider>
                  <SettingsDrawer />
                  <ProgressBar />

                  <Router />
                </CheckoutProvider>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}
