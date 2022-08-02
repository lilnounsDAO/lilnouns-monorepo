declare namespace Express {
  interface Request {
    user?: {
      wallet: string;
      lilnounCount: number;
    };
  }
}
