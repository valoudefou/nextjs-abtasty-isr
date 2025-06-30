import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import FormStep1 from '../components/FormStep1';
import FormStep2 from '../components/FormStep2';
import { FormData } from '../types';
import { startFlagshipSDKAsync } from "../startFlagshipSDK";

interface HomeProps {
  flagBirthField: boolean;
  timestamp: string;
  initialVisitorData: any;
  initialFlagsData: any;
}

const Home: React.FC<HomeProps> = ({ flagBirthField, timestamp }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  });

  // Add local state for the flag
  const [localFlagBirthField, setLocalFlagBirthField] = useState(flagBirthField);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => setCurrentStep(2);
  const previousStep = () => setCurrentStep(1);

  // Toggle function for the flag
  const toggleFlag = () => {
    setLocalFlagBirthField(prev => !prev);
  };

  return (
    <Layout flagBirthField={localFlagBirthField}>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Page generated at: {timestamp}
        </p>
      </div>

      {currentStep === 1 ? (
        <FormStep1
          data={formData}
          onUpdate={updateFormData}
          onNext={nextStep}
          flagBirthField={localFlagBirthField}
          onToggleFlag={toggleFlag} // Add this prop
        />
      ) : (
        <FormStep2
          data={formData}
          onUpdate={updateFormData}
          onPrevious={previousStep}
          flagBirthField={localFlagBirthField}
          onToggleFlag={toggleFlag} // Add this prop
        />
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const flagship = await startFlagshipSDKAsync();

  const visitor = flagship.newVisitor({
    visitorId: undefined,
    hasConsented: true,
    context: {
      user: "me",
    },
  });

  await visitor.fetchFlags();

  const flagBirthField = visitor.getFlag("flagBirthField").getValue(false);

  return {
    props: {
      flagBirthField,
      timestamp: new Date().toISOString(),
      initialVisitorData: { id: visitor.visitorId },
      initialFlagsData: visitor.getFlags().toJSON(),
    },
    revalidate: 60,
  };
};

export default Home;
