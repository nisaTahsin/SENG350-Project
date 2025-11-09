import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('🔍 JWT payload received:', payload);
    
    // Map the JWT payload to the expected user format
    const user = { 
      userId: payload.sub || payload.userId, // 'sub' is standard JWT field for user ID
      username: payload.username,
      role: payload.role,
      email: payload.email
    };
    
    console.log('✅ JWT validation successful, user:', user);
    return user;
  }
}