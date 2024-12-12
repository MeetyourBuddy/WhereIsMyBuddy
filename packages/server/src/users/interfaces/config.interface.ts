export interface JwtConfig {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  }
  
  export interface GoogleConfig {
    clientId: string;
    clientSecret: string;
    callbackURL: string;
  }
  
  export interface AuthConfig {
    jwt: JwtConfig;
    google: GoogleConfig;
  }