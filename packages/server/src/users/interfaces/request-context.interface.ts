import { Request } from 'express';
import { User } from '../schemas/user.schema';
import { JwtPayload, GoogleUser } from '../auth/interfaces/auth.interface';

export interface RequestContext extends Request {
  user?: User;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface TokenRequest extends Request {
  user: JwtPayload;
}

export interface GoogleAuthRequest extends Request {
  user: GoogleUser;
}
