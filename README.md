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
import { HitType, EventCategory } from '@flagship.io/react-sdk';
import { startFlagshipSDKAsync } from '../startFlagshipSDK';

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

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout flagBirthField={flagBirthField}>
      <p>Page generated at: {timestamp}</p>
      {currentStep === 1 ? (
        <FormStep1
          data={formData}
          onUpdate={updateFormData}
          onNext={() => setCurrentStep(2)}
          flagBirthField={flagBirthField}
        />
      ) : (
        <FormStep2
          data={formData}
          onUpdate={updateFormData}
          onPrevious={() => setCurrentStep(1)}
          flagBirthField={flagBirthField}
        />
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const flagship = await startFlagshipSDKAsync();

  const visitor = flagship.newVisitor({
    visitorId: 'static-visitor-id',
    hasConsented: true,
    context: {},
  });

  await visitor.fetchFlags();

  const flagBirthField = visitor.getFlag("flagBirthField").getValue(true);

  await visitor.sendHit({
    type: HitType.EVENT,
    category: EventCategory.ACTION_TRACKING,
    action: "page viewed",
  });

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

### 🔄 How ISR Works Here

- `getStaticProps` is executed at **build time** and then **periodically re-run** based on the `revalidate` setting.
- The Flagship SDK is initialized server-side.
- Visitor flags are fetched and passed as props.

---

### ✅ Final Notes

- Use `getStaticProps` + `revalidate` for performance and near-real-time updates.
- You can also integrate `getServerSideProps` for user-specific personalization.
- For dynamic `visitorId`, consider generating one based on a hash of IP/User-Agent or from cookies.