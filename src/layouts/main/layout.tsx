import Box from '@mui/material/Box';
import ChatBot from 'src/components/chat/chat-bot';
import Header from './header';
import Footer from './footer';


// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: 1,
          py: { xs: 8, md: 10 },
        }}
      >
        {children}
      </Box>

      <Footer />
      
      <ChatBot />
    </Box>
  );
} 