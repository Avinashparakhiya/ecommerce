import { Injectable, ExecutionContext, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, throwError } from 'rxjs';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isAuthEnabled = super.canActivate(context);

    if (!isAuthEnabled) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
        throw new HttpException('Roles required', HttpStatus.FORBIDDEN);
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    const user: JwtPayload = this.decodeToken(token);

    if (!user || !user.role) {
        throw new HttpException('User role required', HttpStatus.FORBIDDEN);
    }

    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
    }

    return true;
  }

  private extractTokenFromRequest(request: any): string {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  }

  private decodeToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
