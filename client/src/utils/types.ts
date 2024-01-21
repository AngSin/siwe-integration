import { SiweMessage } from "siwe";

export type User = {
  name: string;
  bio?: string;
  image?: string;
};

export type WalletContext = {
  wallet?: string;
  signInWithEthereum: () => Promise<boolean>;
  logout: () => void;
};

export type VerifySignatureRequestBody = { message: string; signature: string };
