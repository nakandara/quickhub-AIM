import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Dialog, DialogContent, TextField, Stack, Typography, Avatar, CircularProgress } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { sendChatMessage } from 'src/api/chat-ai';
import Markdown from 'src/components/markdown';

const StyledChatBot = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

const StyledChatDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '360px',
    maxHeight: '70vh',
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
  },
}));

const StyledMessageList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const StyledMessage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isBot',
})<{ isBot?: boolean }>(({ theme, isBot }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isBot ? theme.palette.background.neutral : theme.palette.primary.lighter,
  alignSelf: isBot ? 'flex-start' : 'flex-end',
}));

interface Message {
  text: string;
  isBot: boolean;
}

export default function ChatBot() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I help you today?', isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    
    // Show loading state
    setLoading(true);

    try {
      // Get response from AI
      const response = await sendChatMessage(userMessage);
      
      // Add bot response
      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      enqueueSnackbar('Failed to get response from chat bot', { variant: 'error' });
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, I encountered an error. Please try again.', isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledChatBot>
        <IconButton
          onClick={handleOpen}
          sx={{
            width: 56,
            height: 56,
            overflow: 'hidden',
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: (theme) => theme.customShadows.primary,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Box
            component="img"
            src="/assets/images/chat/Chat1.jpeg"
            alt="Chat Assistant"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </IconButton>
      </StyledChatBot>

      <StyledChatDialog open={open} onClose={handleClose}>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '60vh' }}>
          {/* Chat Header */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
          >
            <Avatar
              src="/assets/images/chat/Chat1.jpeg"
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: 'primary.lighter',
                '& img': {
                  objectFit: 'cover',
                }
              }}
            />
            <Box>
              <Typography variant="subtitle1">Chlani</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {loading ? 'typing...' : 'Online'}
              </Typography>
            </Box>
          </Stack>

          {/* Messages */}
          <StyledMessageList>
            {messages.map((message, index) => (
              <StyledMessage key={index} isBot={message.isBot}>
                <Typography variant="body2" component="div">
                  <Markdown children={message.text} />
                </Typography>
              </StyledMessage>
            ))}
          </StyledMessageList>

          {/* Input */}
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{
              p: 2,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" color="primary" disabled={!input.trim() || loading}>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Iconify icon="ic:round-send" />
                    )}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogContent>
      </StyledChatDialog>
    </>
  );
} 