export interface AuthenticatedRequest extends Request {
  user: { phoneNumber: string };
}
