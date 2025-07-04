import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FormStep1 from '../components/FormStep1';
import FormStep2 from '../components/FormStep2';
import { FormData } from '../types';
import { startFlagshipSDKAsync } from "../startFlagshipSDK";

interface HomeProps {
  timestamp: string;
  pageTemplate: string;
}

const generateNewVisitorId = () => {
  return 'visitor_' + Math.random().toString(36).substring(2, 10);
};

const getVisitorIdFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )fs_visitor_id=([^;]+)'));
  return match ? match[2] : null;
};

const Home: React.FC<HomeProps> = ({ timestamp, pageTemplate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  });

  const [flagBirthField, setFlagBirthField] = useState(false);
  const [localFlagBirthField, setLocalFlagBirthField] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorIdFromCookie() || generateNewVisitorId();

    async function initFlags() {
      const flagship = await startFlagshipSDKAsync();
      const visitor = flagship.newVisitor({
        visitorId,
        hasConsented: true,
        context: {
          page_template: pageTemplate,
          user: "me", // add any other user context here
        },
      });
      await visitor.fetchFlags();
      const flagValue = visitor.getFlag("flagBirthField").getValue(false);
      setFlagBirthField(flagValue);
      setLocalFlagBirthField(flagValue);
    }

    initFlags();
  }, [pageTemplate]);

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

export const getStaticProps = async ({ req }) => {
  // You can fetch any general data or fallback flags here, but NOT user-specific

  // Read the template cookie from headers if available (only works server side)
  const pageTemplate = req?.cookies?.page_template || 'template1';

  return {
    props: {
      timestamp: new Date().toISOString(),
      pageTemplate,
    },
    revalidate: 60, // Re-generate page every second
  };
};

export default Home;
