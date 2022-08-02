import { useContext, useState, createContext, ReactNode, Dispatch, SetStateAction } from 'react';
import Modal from '../components/Modal';

type ApiError =
  | {
      message: string;
      status: number;
    }
  | undefined;

interface ErrorModalCtx {
  error: ApiError;
  setError: Dispatch<SetStateAction<{ message: string; status: number } | undefined>>;
}

const ErrorModalContext = createContext<ErrorModalCtx>({
  error: undefined,
  setError: () => undefined,
});

export const ErrorModalProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState(undefined as ApiError);

  return (
    <ErrorModalContext.Provider
      value={{
        error,
        setError,
      }}
    >
      {error && (
        <Modal
          title="Something went wrong!"
          content={error.message}
          onDismiss={() => {
            setError(undefined);
          }}
        />
      )}
      {children}
    </ErrorModalContext.Provider>
  );
};

export const useApiError = () => {
  const context = useContext(ErrorModalContext);
  if (context === undefined) {
    throw new Error('useApiError must be used within an ErrorModalProvider');
  }
  return context;
};
