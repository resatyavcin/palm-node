export class LoginResponseDto {
  email: string;
  requires2FA?: boolean;
  access_token: string;
  refresh_token: string;
  tempToken?: string;
}
