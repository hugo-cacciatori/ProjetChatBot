export function parseJwt(token: string) {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Invalid JWT:', e);
      return null;
    }
  }
  