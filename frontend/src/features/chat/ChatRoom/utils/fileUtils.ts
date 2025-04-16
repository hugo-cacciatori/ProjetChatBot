import * as XLSX from 'xlsx';
import { MESSAGE_SENDER } from '../constants';
import { createMessage } from './messageUtils';
import { Chat, SharedFile } from '../../../../types/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import storage from '../../../auth/utils/storage';

// Circuit breaker state
let failures = 0;
let lastFailureTime = 0;
let isOpen = false;




// Types pour la validation
interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

interface FileUploadResponse {
  success: boolean;
  file?: SharedFile;
  error?: string;
  message?: string;
  products?: any[];
}

interface UserProfile {
  id: number;
  username: string;
}

// Constantes pour la validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];

//Vérifie si un fichier est valide

export const validateFile = (file: File): FileValidationResult => {
  if (!file) {
    return {
      isValid: false,
      error: 'Aucun fichier sélectionné'
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format de fichier non supporté. Veuillez utiliser un fichier Excel (.xlsx)'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Le fichier est trop volumineux. Taille maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  return { isValid: true };
};

//Formate la taille d'un fichier en format lisible
 
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const processExcelFile = (
  event: ProgressEvent<FileReader>,
  file: File,
  chat: Chat,
  chatId: string,
  updateChat: (id: string, updates: Partial<Chat>) => void
): void => {
  try {
    const workbook = XLSX.read(event.target?.result, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Vérification que le fichier contient des données
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (jsonData.length < 2) {
      throw new Error('Le fichier Excel est vide ou ne contient pas de données');
    }
    
    const url = URL.createObjectURL(file);
    
    const newFile: SharedFile = {
      id: Date.now().toString(),
      name: file.name,
      url,
      uploadedAt: new Date().toISOString(),
      size: formatFileSize(file.size)
    };

    const systemMessage = createMessage(`Fichier uploadé: ${file.name} (${formatFileSize(file.size)})`, MESSAGE_SENDER.ASSISTANT);

    updateChat(chatId, {
      files: [...chat.files, newFile],
      messages: [...chat.messages, systemMessage],
      lastMessage: `Fichier uploadé: ${file.name}`,
    });

    // Reset on success
    failures = 0;
  } catch (error) {
    console.error('Erreur lors du traitement du fichier Excel:', error);
    const errorMessage = createMessage(`Erreur lors du traitement du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, MESSAGE_SENDER.ASSISTANT);
    updateChat(chatId, {
      messages: [...chat.messages, errorMessage],
      lastMessage: `Erreur lors du traitement du fichier`,
    });
    failures++;
    lastFailureTime = Date.now();
    if (failures >= 3) isOpen = true;
  }
};

// Hook personnalisé pour l'upload de fichiers avec React Query
export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<FileUploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      // Check circuit breaker
      console.log('hello')
      if (isOpen) {
        const now = Date.now();
        if (now - lastFailureTime > 5000) { // 5 seconds timeout
          isOpen = false;
          failures = 0;
        } else {
          throw new Error('Service temporairement indisponible. Veuillez réessayer plus tard.');
        }
      }

      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = storage.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }
      const response = await fetch(`http://localhost:3000/generated-request`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      
      // Reset on success
      failures = 0;
      
      if (data.file) {
        queryClient.setQueryData(['sharedFiles'], (oldData: SharedFile[] | undefined) => {
          return oldData ? [...oldData, data.file] : [data.file];
        });
      }
      
      return {
        success: true,
        file: data.file,
        message: data.message || 'Fichier uploadé avec succès',
        products: data.products
      };
    },
    onError: (error: Error) => {
      console.error('Erreur lors du téléchargement du fichier:', error);
      failures++;
      lastFailureTime = Date.now();
      if (failures >= 3) isOpen = true;
    }
  });
};

//Récupère le profil de l'utilisateur
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const token = storage.getToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  const response = await fetch('http://localhost:3000/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  return response.json();
};

// types.ts (or wherever you define types)
export interface GPTResponse {
  id: string;
  userId: string;
  generatedText: string;
  createdAt: string;
}

export const getGPTResponse = async (userId: number): Promise<any> => {
  const token = storage.getToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  const response = await fetch(`http://localhost:3000/generated-request/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('Raw Fetch Response:', response);

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  const data = await response.json();

  console.log('Parsed JSON Response:', data);

  return data;
};
