import { useMutation } from '@tanstack/react-query';
import { registerUser, RegisterDto, UserResponse } from '../api/AuthService';

export const useRegisterUser = () => {
return useMutation<UserResponse, Error, RegisterDto>({
mutationFn: registerUser,
});
};