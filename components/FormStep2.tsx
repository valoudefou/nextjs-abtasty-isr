import React from 'react';
import { FormProps } from '../types';
import { useFlagship, HitType, EventCategory } from "@flagship.io/react-sdk";

const FormStep2: React.FC<FormProps> = ({ data, onUpdate, onPrevious, flagBirthField, onToggleFlag}) => {
  const fs = useFlagship();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fs.sendHits({
        type: HitType.EVENT,
        category: EventCategory.USER_ENGAGEMENT,
        action: "Click Complete",
      });
    } catch (error) {
      console.error("Tracking failed:", error);
    }

    alert('Form completed successfully!\n\n' + JSON.stringify(data, null, 2));
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
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginRight: '1rem'
  };

  // Validation: email required; dateOfBirth required only if flagBirthField is true
  const isValid = data.email.trim() && (!flagBirthField || data.dateOfBirth.trim());

  return (
    <div>
      <h2>Step 2: Contact Information</h2>
      
      {/* Toggle Button for Birth Field Flag */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={handleToggle}
          style={{
            ...buttonStyle,
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

      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            placeholder="Enter your email"
            style={inputStyle}
            required
          />
        </div>

        {flagBirthField && (
          <div>
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
              style={inputStyle}
              required
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={onPrevious}
            style={{
              ...buttonStyle,
              backgroundColor: '#6c757d',
              color: 'white',
              flex: 1
            }}
          >
            Previous
          </button>

          <button 
            onClick={handleSubmit}
            disabled={!isValid}
            style={{
              ...buttonStyle,
              backgroundColor: isValid ? '#28a745' : '#ccc',
              color: 'white',
              flex: 1
            }}
          >
            Complete
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <h3>Current Form Data:</h3>
        <pre style={{ fontSize: '0.9rem' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FormStep2;
