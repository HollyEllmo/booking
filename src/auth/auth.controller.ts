import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignDto } from './dto/sign.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sign(@Body() dto: SignDto) {
    const token = await this.authService.sign(dto.email, dto.password);
    return { access_token: token };
  }
}
