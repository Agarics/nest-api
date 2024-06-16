declare global {
  namespace Express {
    interface Request {
      $validatedPayload?: any;
    }
  }
}

export {};
