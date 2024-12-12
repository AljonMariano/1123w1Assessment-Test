import { Box, Paper, TextField, Button, Typography, IconButton } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Message {
  _id: string;
  content: string;
  sender: string;
  timestamp: string;
  attachment?: {
    type: string;
    url: string;
  };
}

function Chat({ currentNumber = '' }: { currentNumber?: string }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = 'http://192.168.100.9:3000';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      // Sort messages by timestamp in ascending order
      const sortedMessages = data.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setMessages(sortedMessages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderAttachment = (msg: Message) => {
    if (!msg.attachment) return null;
    
    if (msg.attachment.type === 'image') {
      return (
        <Box sx={{ mt: 1 }}>
          <img 
            src={`${API_URL}${msg.attachment.url}`} 
            alt="attachment" 
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '10px',
              objectFit: 'cover'
            }}
          />
        </Box>
      );
    }
    
    return null;
  };

  // Initial load of messages
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        // Sort messages by timestamp in descending order (newest last)
        const sortedMessages = data.sort((a: Message, b: Message) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
        setTimeout(scrollToBottom, 100); // Scroll to bottom after messages load
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setInitialLoad(false);
      }
    };

    loadInitialMessages();
  }, []);

  // Silent polling for new messages
  useEffect(() => {
    if (initialLoad) return;

    const pollMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        const sortedMessages = data.sort((a: Message, b: Message) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        if (sortedMessages.length !== messages.length) {
          setMessages(sortedMessages);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [messages.length, initialLoad]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message.trim(),
          sender: currentNumber || 'Anonymous',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to send message');
      setMessage('');
      
      // Fetch and update messages
      const messagesResponse = await fetch(`${API_URL}/messages`);
      const data = await messagesResponse.json();
      const sortedMessages = data.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setMessages(sortedMessages);
      scrollToBottom();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sender', currentNumber || 'Anonymous');

    try {
      const response = await fetch(`${API_URL}/messages/attachment`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload file');
      // Instead of calling fetchMessages directly, wait a moment and then fetch
      setTimeout(fetchMessages, 500); // Add a small delay to ensure the server has processed the upload
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f5f5f5'
    }}>
      {initialLoad ? (
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Typography>Loading messages...</Typography>
        </Box>
      ) : (
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {messages.map((msg, index) => {
            // Check if the message is from the current user by comparing phone numbers
            const isCurrentUser = msg.sender === currentNumber;
            const showSenderChange = index === 0 || messages[index - 1].sender !== msg.sender;

            return (
              <Box
                key={msg._id}
                sx={{
                  width: '100%', // Add this to ensure proper alignment
                  display: 'flex',
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', // This controls left/right alignment
                  mb: 1
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    bgcolor: isCurrentUser ? '#1976d2' : 'white',
                    color: isCurrentUser ? 'white' : 'black',
                    borderRadius: 2,
                    boxShadow: 1
                  }}
                >
                  {msg.content && (
                    <Typography variant="body1">{msg.content}</Typography>
                  )}
                  {msg.attachment && msg.attachment.type === 'image' && (
                    <Box sx={{ mt: msg.content ? 1 : 0 }}>
                      <img 
                        src={`${API_URL}${msg.attachment.url}`} 
                        alt="attachment" 
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '10px',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isCurrentUser ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      )}

      <Box sx={{ 
        p: 2, 
        bgcolor: 'white', 
        borderTop: 1, 
        borderColor: 'divider',
        display: 'flex',
        gap: 1,
        alignItems: 'center'
      }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,video/*,audio/*"
        />
        <IconButton 
          onClick={handleAttachmentClick}
          size="small"
          color="primary"
        >
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Type a message..."
        />
        <Button 
          variant="contained"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;