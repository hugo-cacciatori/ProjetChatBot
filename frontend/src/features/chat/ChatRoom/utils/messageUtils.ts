import { MESSAGE_SENDER, AUTO_REPLIES, DEFAULT_REPLY_PREFIX } from '../constants';
import { Message, Chat } from '../../../../types/common';

export const createMessage = (content: string, sender: typeof MESSAGE_SENDER[keyof typeof MESSAGE_SENDER]): Message => ({
  id: Date.now().toString(),
  content,
  sender,
  timestamp: new Date().toISOString(),
});

export const generateAutoReply = async (
  userMessage: string,
  currentMessages: Message[],
  chatId: string,
  updateChat: (id: string, updates: Partial<Chat>) => void
): Promise<void> => {
  if (!chatId) return;

  await new Promise(resolve => setTimeout(resolve, 1000));

  const matchedKey = Object.keys(AUTO_REPLIES).find(key => 
    userMessage.toLowerCase().includes(key)
  );
  const replyContent = matchedKey 
    ? AUTO_REPLIES[matchedKey] 
    : `${DEFAULT_REPLY_PREFIX}${userMessage}`;

  const replyMessage = createMessage(replyContent, MESSAGE_SENDER.ASSISTANT);

  updateChat(chatId, {
    messages: [...currentMessages, replyMessage],
    lastMessage: replyContent,
  });
};