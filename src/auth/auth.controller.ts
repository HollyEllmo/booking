import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignDto } from './dto/sign.dto';
import { AuthTokenDto } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignDto })
  @ApiOkResponse({ type: AuthTokenDto })
  async sign(@Body() dto: SignDto) {
    const token = await this.authService.sign(dto.email, dto.password);
    return { access_token: token };
  }
}
