import { Link } from 'react-router-dom';

const LoginLink: React.FC = () => (
  <p className="mt-4 text-center text-sm text-gray-600">
    Already have an account?{' '}
    <Link to="/login" className="text-blue-500 hover:text-blue-600">
      Sign in
    </Link>
  </p>
);

export default LoginLink;