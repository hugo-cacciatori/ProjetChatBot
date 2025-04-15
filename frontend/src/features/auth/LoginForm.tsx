import FormInput from '../common/FormInput';
import SubmitButton from '../common/SubmitButton';

interface LoginFormProps {
  formData: {
    username: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  formData, 
  handleChange, 
  handleSubmit 
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <FormInput
      label="Username"
      name="username"
      type="text"
      value={formData.username}
      onChange={handleChange}
      required
    />
    <FormInput
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      required
    />
    <SubmitButton text="Sign In" />
  </form>
);

export default LoginForm;
