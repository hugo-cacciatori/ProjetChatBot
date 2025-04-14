import SubmitButton from '../common/SubmitButton';

interface GuestLoginButtonProps {
  handleGuestLogin: () => void;
}

const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({ handleGuestLogin }) => (
  <div className="mt-4">
    <SubmitButton 
      text="Continue as Guest" 
      className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
      onClick={handleGuestLogin}
    />
  </div>
);

export default GuestLoginButton;