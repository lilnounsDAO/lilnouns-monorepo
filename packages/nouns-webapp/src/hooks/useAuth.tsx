import { useContext, useState, createContext, ReactNode } from 'react';
import { useEthers } from '@usedapp/core';
import Cookies from 'js-cookie';
import { SiweMessage } from 'siwe';

const HOST = 'http://localhost:5001';

interface AuthCtx {
  isLoggedIn: boolean;
  triggerSignIn: (callback: () => void) => Promise<void>;
  logout: () => void;
  getAuthHeader: () => { ['Authorization']: string } | undefined;
  getAuthToken: () => string | undefined;
}

const AuthContext = createContext<AuthCtx>({
  isLoggedIn: false,
  triggerSignIn: async () => undefined,
  logout: () => undefined,
  getAuthHeader: () => undefined,
  getAuthToken: () => undefined,
});

// Create message for user to sign to authenticate.
const createSiweMessage = async (
  address: string | undefined,
  statement: string,
  chainId?: number,
) => {
  const res = await fetch(`${HOST}/nonce`);
  const { data } = await res.json();

  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement,
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce: data.nonce,
  });
  return message.prepareMessage();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getAuthToken = () => Cookies.get('lil-noun-token');
  const getAuthHeader = () => ({ Authorization: `Bearer ${getAuthToken()}` });

  const { library, account, chainId } = useEthers();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getAuthToken()));

  // Sign in with ethereum flow. Need to auth users so we know the signer is who they claim to be.
  const signInWithEthereum = async (callback: () => void) => {
    if (!account) {
      console.log('Connect wallet');
      return;
    }
    const signer = library?.getSigner();

    const message = await createSiweMessage(
      await signer?.getAddress(),
      'Sign in with Ethereum to the app.',
      chainId,
    );

    const signature = await signer?.signMessage(message);

    const res = await fetch(`${HOST}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
    });

    if (res.status !== 200) {
      console.log('Unauthorized');
      return;
    }

    const data = await res.json();

    const one_hour = new Date(new Date().getTime() + 3600 * 1000);
    Cookies.set('lil-noun-token', data.data.accessToken, { expires: one_hour });
    setIsLoggedIn(true);

    if (callback) {
      callback();
    }
  };

  const logout = () => {
    if (isLoggedIn) {
      Cookies.remove('lil-noun-token');
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, triggerSignIn: signInWithEthereum, logout, getAuthToken, getAuthHeader }}
      children={children}
    />
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
