export const MESSAGE_SENDER = {
    USER: 'user',
    ASSISTANT: 'assistant',
  } as const;
  
  export const AUTO_REPLIES: Record<string, string> = {
    hello: 'Hello! How can I help you today?',
    hi: 'Hello! How can I help you today?',
    thank: "You're welcome! Is there anything else you need help with?",
    bye: 'Goodbye! Have a great day!',
  };
  
  export const DEFAULT_REPLY_PREFIX = 'I understand you said: ';