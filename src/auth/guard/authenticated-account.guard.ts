import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticatedAccountGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
