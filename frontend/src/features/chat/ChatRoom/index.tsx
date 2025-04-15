import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../../../context/ChatContext';
import { MESSAGE_SENDER } from './constants';
import { createMessage, generateAutoReply } from './utils/messageUtils';
import { useFileUpload } from './utils/fileUtils';
import FileHistorySidebar from './components/FileHistorySidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { downloadExcel, jsonToExcel } from './utils/excelFactory';

const ChatRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChat, updateChat } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutate: uploadFile, isPending: isUploading } = useFileUpload();

  const chat = getChat(id!);

  useEffect(() => {
    if (!chat) {
      navigate('/');
    }
  }, [chat, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      
      if (!newMessage.trim() || !chat || !id) return;
  
      const userMessage = createMessage(newMessage, MESSAGE_SENDER.USER);
  
      const updatedChat = {
        ...chat,
        messages: [...chat.messages, userMessage],
        lastMessage: newMessage,
      };
      
      updateChat(id, updatedChat);
      setNewMessage('');
      
      setIsProcessing(true);
      await generateAutoReply(newMessage, updatedChat.messages, id, updateChat);
      setIsProcessing(false);
    },
    [newMessage, chat, id, updateChat]
  );

  const onFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!chat) return;
      const file = event.target.files?.[0];
      if (!file) return;
      
      uploadFile(file, {
        onSuccess: (result) => {
          if (result.file) {
            const systemMessage = createMessage(`Fichier uploadé: ${result.file.name}`, MESSAGE_SENDER.ASSISTANT);
            updateChat(id!, {
              files: [...chat.files, result.file],
              messages: [...chat.messages, systemMessage],
              lastMessage: `Fichier uploadé: ${result.file.name}`,
            });

            try {
              // 1. Get user profile
              // TODO : requête Profil
              // const user = await getUserProfile(); // Implement this function
              
              // 2. Process file with GPT
              // TODO : requête generated-request/user.id
              // const gptReturnJsonData = await processFileWithGPT(file, user.id); // Implement this function
              
              // 3. Convert to Excel
              // const gptReturnExcelFile = jsonToExcel(gptReturnJsonData);

              // downloadExcel(gptReturnExcelFile, `resultat-${result.file.name}.xlsx`);
              
              
            } catch (error) {
              // handle error
            }
          }
        },
        onError: (error) => {
          const errorMessage = createMessage(`Erreur: ${error.message}`, MESSAGE_SENDER.ASSISTANT);
          updateChat(id!, {
            messages: [...chat.messages, errorMessage],
            lastMessage: `Erreur lors de l'upload du fichier`,
          });
        }
      });
    },
    [chat, id, updateChat, uploadFile]
  );

  if (!chat) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <FileHistorySidebar files={chat.files} />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          chatName={chat.name} 
          onBack={() => navigate('/')}
          onUpload={() => fileInputRef.current?.click()}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        <MessageList messages={chat.messages} messagesEndRef={messagesEndRef} />
        
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSendMessage}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default ChatRoom;