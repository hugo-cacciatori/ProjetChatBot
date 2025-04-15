const storagePrefix = 'Chatbot-';

const storage = {
  getToken: () => {
    return JSON.parse(localStorage.getItem(`${storagePrefix}token`) as string);
  },

  setToken: (token: string) => {
    if (!token) {
      console.error('token is undefined');
      return;
    }
    localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },

  clearToken: () => {
    localStorage.removeItem(`${storagePrefix}token`);
  },
};

export default storage;
