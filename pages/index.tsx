import React, { useState } from 'react';
import { GetServerSideProps, GetStaticProps } from 'next';
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
  pageTemplate: string;
}

const Home: React.FC<HomeProps> = ({
  flagBirthField,
  timestamp,
  pageTemplate,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  });

  const [localFlagBirthField, setLocalFlagBirthField] = useState(flagBirthField);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(2);
  const previousStep = () => setCurrentStep(1);

  const toggleFlag = () => {
    setLocalFlagBirthField(prev => !prev);
  };

  return (
    <Layout flagBirthField={localFlagBirthField} pageTemplate={pageTemplate}>
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
          onToggleFlag={toggleFlag}
          pageTemplate={pageTemplate}
        />
      ) : (
        <FormStep2
          data={formData}
          onUpdate={updateFormData}
          onPrevious={previousStep}
          flagBirthField={localFlagBirthField}
          onToggleFlag={toggleFlag}
          pageTemplate={pageTemplate}
        />
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const flagship = await startFlagshipSDKAsync();

  // Use default or fallback visitorId and pageTemplate here
  const visitorId = undefined;
  const pageTemplate = 'template1';

  const visitor = flagship.newVisitor({
    visitorId,
    hasConsented: true,
    context: {
      page_template: pageTemplate,
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
      pageTemplate,
    },
    revalidate: 1,
  };
};

export default Home;
