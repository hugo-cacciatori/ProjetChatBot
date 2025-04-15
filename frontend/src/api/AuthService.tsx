    export interface RegisterDto {
        username: string;
        password: string;
    }
    
    export interface UserResponse {
        id: string;
        username: string;
        createdAt?: string; // optional if not always returned
        updatedAt?: string;
      }
      
    
    export async function registerUser(data: RegisterDto): Promise<UserResponse> {
    console.log(data);
    const res = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });
    
    if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || 'Failed to register');
    }
    
    return res.json();
    }

    export interface LoginDto {
        username: string;
        password: string;
      }
      
    export interface LoginResponse {
    access_token: string;
    }
    
    export async function loginUser(data: LoginDto): Promise<LoginResponse> {
    const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || 'Failed to login');
    }
    
    return res.json();
    }