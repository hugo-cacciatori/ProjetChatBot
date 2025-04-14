import { Link } from 'react-router-dom';

const SignUpLink: React.FC = () => (
  <p className="mt-4 text-center text-sm text-gray-600">
    Don't have an account?{' '}
    <Link to="/register" className="text-blue-500 hover:text-blue-600">
      Sign up
    </Link>
  </p>
);

export default SignUpLink;