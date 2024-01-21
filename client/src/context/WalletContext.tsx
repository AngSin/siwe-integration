import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {WalletContext} from "../utils/types";
import {checkUserLoggedIn, getNonce, logOut, verifySignature} from "../utils/api";
import {BrowserProvider} from "ethers";
import {SiweMessage} from "siwe";
import {getSiweCookie} from "../utils/siwe-cookie";

export const initialWalletState = {
  wallet: undefined,
  signInWithEthereum: () => Promise.resolve(false),
  logout: () => {},
};

export const walletContext = createContext<WalletContext>(initialWalletState);

export const WalletContextProvider = (props: PropsWithChildren) => {
  const [wallet, setWallet] = useState<string>();
  const siweCookie = getSiweCookie();
  const domain = window.location.host;
  const origin = window.location.origin;
  const createSiweMessage = async (address: string, statement?: string) => {
    const nonce = await getNonce();
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: "1",
      chainId: 1,
      nonce,
    });
    return message.prepareMessage();
  };

  const logout = async () => {
    await logOut();
    setWallet(undefined);
  };

  const connectWallet = () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      provider?.send("eth_requestAccounts", [])
        .catch(() => console.log("user rejected request"));
    }
  };

  const signInWithEthereum = async (): Promise<boolean> => {
    if (window.ethereum) {
      try {
        const wallet = await checkUserLoggedIn();
        await setWallet(wallet);
        return true; // if user is already logged in we don't need to sign
      } catch (e) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const message = await createSiweMessage(
            signer.address,
            "Sign in with Ethereum to the app.",
          );
          const newSignature = await signer.signMessage(message);
          const isVerified = await verifySignature({
            message,
            signature: newSignature,
          });
          if (isVerified) {
            await setWallet(signer.address)
          }
          return isVerified;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    connectWallet();
  }, [window.ethereum]); //eslint-disable-line react-hooks/exhaustive-deps

  const fetchWallet = async () => {
    try {
      const wallet = await checkUserLoggedIn();
      await setWallet(wallet);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (siweCookie) {
      fetchWallet();
    } else {
      setWallet(undefined)
    }
  }, [siweCookie]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <walletContext.Provider
      value={{
        wallet,
        logout,
        signInWithEthereum,
      }}
    >
      {props.children}
    </walletContext.Provider>
  );
};
