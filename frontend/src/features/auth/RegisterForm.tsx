import FormInput from '../common/FormInput';
import { FormInputs } from './types.ts';

interface RegisterFormProps {
  formData: FormInputs;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  inputClasses: string;
  buttonClasses: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  inputClasses,
  buttonClasses
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <FormInput
      label="Username"
      name="username"
      type="text"
      value={formData.username}
      onChange={handleChange}
      required
      className={inputClasses}
    />

    <FormInput
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      required
      className={inputClasses}
    />

    
    <button
      type="submit"
      disabled={isSubmitting}
      className={buttonClasses}
    >
      {isSubmitting ? 'Signing Up...' : 'Sign Up'}
    </button>
  </form>
);

export default RegisterForm;