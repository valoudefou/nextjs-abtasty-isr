// pages/_app.tsx or _app.jsx
import { FlagshipProvider } from '@flagship.io/react-sdk'

function MyApp({ Component, pageProps }) {
  const { initialVisitorData, initialFlagsData } = pageProps;

  return (
    <FlagshipProvider
      envId={process.env.NEXT_PUBLIC_ENV_ID}
      apiKey={process.env.NEXT_PUBLIC_API_KEY}
      visitorData={initialVisitorData || {}}
      initialFlagsData={initialFlagsData}
    >
      <Component {...pageProps} />
    </FlagshipProvider>
  );
}

export default MyApp;
