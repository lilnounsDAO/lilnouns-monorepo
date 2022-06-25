import "express-session";

declare module "express-session" {
  interface Session {
    nonce?: string;
    siwe: any;
    fauna: any;
  }
}