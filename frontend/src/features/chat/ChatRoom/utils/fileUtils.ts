import * as XLSX from 'xlsx';
import { MESSAGE_SENDER } from '../constants';
import { createMessage } from './messageUtils';
import { Chat, SharedFile } from '../../../../types/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import storage from '../../../auth/utils/storage';

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
}

// Constantes pour la validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];

/**
 * Vérifie si un fichier est valide
 */
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

/**
 * Formate la taille d'un fichier en format lisible
 */
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
  } catch (error) {
    console.error('Erreur lors du traitement du fichier Excel:', error);
    const errorMessage = createMessage(`Erreur lors du traitement du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, MESSAGE_SENDER.ASSISTANT);
    updateChat(chatId, {
      messages: [...chat.messages, errorMessage],
      lastMessage: `Erreur lors du traitement du fichier`,
    });
  }
};

// Fonction pour uploader un fichier au backend
const uploadFileToBackend = async (file: File): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = storage.getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/generated-request`, { 
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
    return {
      success: true,
      file: data.file,
      message: data.message || 'Fichier uploadé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'upload du fichier'
    };
  }
};

// Hook personnalisé pour l'upload de fichiers avec React Query
export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<FileUploadResponse, Error, File>({
    mutationFn: uploadFileToBackend,
    onSuccess: (data: FileUploadResponse) => {
      if (data.file) {
        queryClient.setQueryData(['sharedFiles'], (oldData: SharedFile[] | undefined) => {
          return oldData ? [...oldData, data.file] : [data.file];
        });
      }
    },
    onError: (error: Error) => {
      console.error('Erreur lors du téléchargement du fichier:', error);
    }
  });
};

export const handleFileUpload = async (file: File): Promise<FileUploadResponse> => {
  const validation = validateFile(file);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error
    };
  }

  try {
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
    return {
      success: true,
      file: data.file,
      message: data.message || 'Fichier uploadé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'upload du fichier'
    };
  }
};