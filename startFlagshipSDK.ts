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
