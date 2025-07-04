<img src="https://content.partnerpage.io/eyJidWNrZXQiOiJwYXJ0bmVycGFnZS5wcm9kIiwia2V5IjoibWVkaWEvY29udGFjdF9pbWFnZXMvMDUwNGZlYTYtOWIxNy00N2IyLTg1YjUtNmY5YTZjZWU5OTJiLzI1NjhmYjk4LTQwM2ItNGI2OC05NmJiLTE5YTg1MzU3ZjRlMS5wbmciLCJlZGl0cyI6eyJ0b0Zvcm1hdCI6IndlYnAiLCJyZXNpemUiOnsid2lkdGgiOjEyMDAsImhlaWdodCI6NjI3LCJmaXQiOiJjb250YWluIiwiYmFja2dyb3VuZCI6eyJyIjoyNTUsImciOjI1NSwiYiI6MjU1LCJhbHBoYSI6MH19fX0=" alt="AB Tasty logo" width="350"/>

## 🔩 Flagship SDK + Next.js with ISR

This guide explains how to integrate [AB Tasty's Flagship SDK](https://docs.developers.flagship.io/) in a **Next.js app using Incremental Static Regeneration (ISR)** to optimize feature flagging and experimentation on statically generated pages.

---

### 📦 Prerequisites

- A Flagship environment (with ENV ID & API Key)
- A Next.js project (`npx create-next-app`)
- Node.js 16+
- Your flags set up in Flagship
- Environment variables:
  ```env
  NEXT_PUBLIC_ENV_ID=your-env-id
  NEXT_PUBLIC_API_KEY=your-api-key
  ```

---

### 📁 Project Structure

```
my-nextjs-app/
│
├── pages/
│   └── index.tsx
│
├── components/
│   ├── Layout.tsx
│   ├── FormStep1.tsx
│   └── FormStep2.tsx
│
├── startFlagshipSDK.ts  ← central SDK initializer
│
└── types/
    └── index.ts
```

---

### 🚀 SDK Initialization with `startFlagshipSDK.ts`

Create a reusable async initializer:

```ts
// startFlagshipSDK.ts

import { DecisionMode, Flagship, FSSdkStatus } from "@flagship.io/react-sdk";

export async function startFlagshipSDKAsync() {
  if (
    Flagship.getStatus() &&
    Flagship.getStatus() !== FSSdkStatus.SDK_NOT_INITIALIZED
  ) {
    return Flagship;
  }

  return await Flagship.start(
    process.env.NEXT_PUBLIC_ENV_ID!,
    process.env.NEXT_PUBLIC_API_KEY!,
    {
      fetchNow: false,
      decisionMode: DecisionMode.DECISION_API,
    }
  );
}
```

---

### 🧠 Using ISR with Flagship in `getStaticProps`

Example for `pages/index.tsx`:

```tsx
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
```

---


### 🎛️ Conditional Display of Birth Field in `FormStep2.tsx`

This feature enables dynamic control over whether the **Date of Birth** field is displayed in the form, using a feature flag passed to the `FormStep2` component as a prop.

#### 🧩 How It Works

1. **Flag Prop Passed to the Component**

   The `FormStep2.tsx` component receives a prop named `flagBirthField` (a `boolean`) that determines whether the birth field should be shown. This flag can be set at the page level using `getStaticProps`, `getServerSideProps`, or manually passed when rendering the component.

   Example:
   ```tsx
   <FormStep2
     data={formData}
     onUpdate={handleUpdate}
     onPrevious={goBack}
     flagBirthField={true} // or dynamically fetched value
     onToggleFlag={toggleBirthFieldFlag}
   />
   ```

2. **Conditional Rendering in the Component**

   Inside `FormStep2.tsx`, the birth field is conditionally displayed using a simple `if` check:

   ```tsx
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
   ```
---

### 🧪 Tracking User Actions on Form Completion

In `FormStep2.tsx`, send a hit event when the user completes the form:

```tsx
import { HitType, EventCategory } from "@flagship.io/react-sdk";
import { startFlagshipSDKAsync } from "../startFlagshipSDK";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  alert('Form completed successfully!');

  try {
    const flagship = await startFlagshipSDKAsync();
    const visitor = flagship.newVisitor({ visitorId: "static-visitor-id", hasConsented: true });

    await visitor.sendHit({
      type: HitType.EVENT,
      category: EventCategory.ACTION_TRACKING,
      action: "Click Complete",
    });

    console.log("Hit sent successfully");
  } catch (error) {
    console.error("Error sending hit:", error);
  }
};
```

---

### ⚙️ How ISR Works Here

- `getStaticProps` is executed at **build time** and then **periodically re-run** based on the `revalidate` setting.
- The Flagship SDK is initialized server-side.
- Visitor flags are fetched and passed as props.

---

### ✅ Final Notes

- Use `getStaticProps` + `revalidate` for performance and near-real-time updates.
- You can also integrate `getServerSideProps` for user-specific personalization.
- For dynamic `visitorId`, consider generating one based on a hash of IP/User-Agent or from cookies.

---

### 🔄 Latest Update

- Previously, `getServerSideProps` was used to fetch visitor flags on every request, impacting performance and scalability.
- The approach has been switched to `getStaticProps` with ISR, configured to revalidate every second (`revalidate: 1`).
- This means pages are statically generated at build time and regenerated in the background at most once per second, balancing performance and near-real-time freshness.
- For user-specific personalization, combine ISR with client-side fetching or cookies.