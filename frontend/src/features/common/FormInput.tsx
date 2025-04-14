interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;  // Add this line
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  required = false,
  className = ''  // Add this with a default value
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 ${className}`}
      required={required}
    />
  </div>
);

export default FormInput;