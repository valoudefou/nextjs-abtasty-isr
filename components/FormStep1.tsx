import React from 'react';
import { FormProps } from '../types';
import { useFlagship, HitType, EventCategory } from "@flagship.io/react-sdk";

const FormStep1: React.FC<FormProps> = ({ data, onUpdate, onNext, flagBirthField, onToggleFlag }) => {
  const fs = useFlagship();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.firstName.trim() && data.lastName.trim()) {
      onNext?.();
    }
  };

  // Handle toggle with tracking
  const handleToggle = async () => {
    try {
      // Send tracking event for the toggle action
      await fs.sendHits({
        type: HitType.EVENT,
        category: EventCategory.USER_ENGAGEMENT,
        action: "Toggle Birth Field Flag",
        label: `Flag set to: ${!flagBirthField}`
      });
    } catch (error) {
      console.error("Tracking failed:", error);
    }
    
    // Call the toggle function from props
    if (onToggleFlag) {
      onToggleFlag();
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

  const toggleButtonStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginRight: '1rem'
  };

  return (
    <div>
      <h2>Step 1: Personal Information</h2>
      
      {/* Toggle Button for Birth Field Flag */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={handleToggle}
          style={{
            ...toggleButtonStyle,
            backgroundColor: flagBirthField ? '#dc3545' : '#007bff',
            color: 'white'
          }}
        >
          {flagBirthField ? 'Hide Birth Field' : 'Show Birth Field'}
        </button>
        <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Birth field is currently: <strong>{flagBirthField ? 'ON' : 'OFF'}</strong>
        </span>
      </div>

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
