interface ErrorMessageProps {
    message?: string | null;  // Make it optional and accept null
    className?: string;
  }
  
  const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
    message, 
    className = "mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm" 
  }) => {
    if (!message) return null;  // Return null if no message
    
    return <div className={className}>{message}</div>;
  };
  
  export default ErrorMessage;