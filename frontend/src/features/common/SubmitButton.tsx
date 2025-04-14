interface SubmitButtonProps {
    text: string;
    className?: string;
    onClick?: () => void;
  }
  
  const SubmitButton: React.FC<SubmitButtonProps> = ({ 
    text, 
    className = 'w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors',
    onClick 
  }) => (
    <button 
      type={onClick ? 'button' : 'submit'} 
      className={className}
      onClick={onClick}
    >
      {text}
    </button>
  );
  
  export default SubmitButton;