declare namespace Express {
  interface Request {
    cognitoClaims: CognitoClaims;
  }
  interface CognitoClaims {
    sub: string;
    username: string;
  }
}
