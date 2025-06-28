import React from 'react';
import { FormProps } from '../types';

const FormStep1: React.FC<FormProps> = ({ data, onUpdate, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.firstName.trim() && data.lastName.trim()) {
      onNext?.();
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  };

  // Example usage of paymentFeature1Click:
  // (You can remove or update this part depending on your use case)
//   const featureMessage = paymentFeature1Click 
//     ? "Payment Feature 1 is enabled" 
//     : "Payment Feature 1 is disabled";

  return (
    <div>
      <h2>Step 1: Personal Information</h2>
      {/* <p>{featureMessage}</p> */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            value={data.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            placeholder="Enter your first name"
            style={inputStyle}
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            value={data.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            placeholder="Enter your last name"
            style={inputStyle}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={buttonStyle}
          disabled={!data.firstName.trim() || !data.lastName.trim()}
        >
          Next Step
        </button>
      </form>
    </div>
  );
};

export default FormStep1;
