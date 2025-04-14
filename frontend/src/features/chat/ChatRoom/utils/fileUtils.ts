import * as XLSX from 'xlsx';
import { MESSAGE_SENDER } from '../constants';
import { createMessage } from './messageUtils';
import { Chat, SharedFile } from '../../../../types/common';

export const processExcelFile = (
  event: ProgressEvent<FileReader>,
  file: File,
  chat: Chat,
  chatId: string,
  updateChat: (id: string, updates: Partial<Chat>) => void
): void => {
  const workbook = XLSX.read(event.target?.result, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const url = URL.createObjectURL(file);
  
  const newFile: SharedFile = {
    id: Date.now().toString(),
    name: file.name,
    url,
    uploadedAt: new Date().toISOString(),
  };

  const systemMessage = createMessage(`File uploaded: ${file.name}`, MESSAGE_SENDER.ASSISTANT);

  updateChat(chatId, {
    files: [...chat.files, newFile],
    messages: [...chat.messages, systemMessage],
    lastMessage: `File uploaded: ${file.name}`,
  });
};

// In fileUtils.ts
export const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    chat: Chat | null | undefined,  // Add undefined to the type
    chatId: string | undefined,
    updateChat: (id: string, updates: Partial<Chat>) => void
  ): void => {
    const file = event.target.files?.[0];
    if (!file || !chat || !chatId) return;  // This will handle undefined chat
  
    // Rest of the function remains the same
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        processExcelFile(e, file, chat, chatId, updateChat);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Error processing Excel file. Please try again.');
      }
    };
    
    reader.onerror = () => {
      console.error('File reading error');
      alert('Error reading file. Please try again.');
    };
    
    reader.readAsBinaryString(file);
  };