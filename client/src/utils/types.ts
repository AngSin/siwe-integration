export type User = {
  name: string;
  bio?: string;
};

export type WalletContext = {
  wallet?: string;
  signInWithEthereum: () => Promise<boolean>;
  logout: () => void;
};

export type VerifySignatureRequestBody = { message: string; signature: string };
