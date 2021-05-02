import { Injectable } from '@nestjs/common';
var bcrypt = require('bcryptjs');
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // generate salt for hashing password
  private async generateSalt(): Promise<string> {
    const salt = await bcrypt.genSalt();
    return salt;
  }

  // hashes the user's plain text password into a cipher
  public async hashPassword(password: string) {
    const salt = await this.generateSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return { salt, hashedPassword };
  }

  // verifies password
  public async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    console.log('Stored Password');
    console.log(hashedPassword);
    console.log('Entered Password');
    console.log(password);
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    console.log(passwordMatch);
    return passwordMatch;
  }

  // generates user access token
  public async generateAccessToken(
    _id: string,
    type?: string,
  ): Promise<string> {
    const payload = { _id };
    let accessToken;
    if (type) {
      accessToken = await this.jwtService.sign(payload, { expiresIn: '5m' });
    } else {
      accessToken = await this.jwtService.sign(payload, { expiresIn: '365d' });
      console.log(Date.now());
    }
    return accessToken;
  }
}
