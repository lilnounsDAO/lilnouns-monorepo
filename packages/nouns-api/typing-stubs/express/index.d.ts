declare namespace Express {
  interface Request {
    user?: {
      wallet: string;
      lilNounsCount: number;
    };
  }
}
