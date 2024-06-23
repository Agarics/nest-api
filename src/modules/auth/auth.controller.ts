import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { EmailService } from '@/processors/helper/helper.service.email';
import { IPService } from '@/processors/helper/helper.service.ip';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AdminUpdateDTO } from './auth.dto';
import { AdminOnlyGuard } from '@/guards/admin-only.guard';
import { TokenResult } from './auth.interface';
import {
  QueryParams,
  QueryParamsResult,
} from '@/decorators/queryparams.decorator';
import { Responser } from '@/decorators/responser.decorator';
import { Admin } from './auth.model';
import { APP } from '@/app.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}
  @Post('login')
  @Responser.handle({ message: 'Login', error: HttpStatus.BAD_REQUEST })
  async login(
    @QueryParams() { visitor: { ip } }: QueryParamsResult,
    @Body() body: AuthLoginDTO,
  ): Promise<TokenResult> {
    const token = await this.authService.adminLogin(body.password);
    if (ip) {
      this.ipService.queryLocation(ip).then((location) => {
        const subject = `App has a new login activity`;
        const locationText = location
          ? [location.country, location.region, location.city].join(' · ')
          : 'unknow';
        const content = `${subject}. IP: ${ip}, location: ${locationText}`;
        this.emailService.sendMailAs(APP.NAME, {
          to: APP.ADMIN_EMAIL,
          subject,
          text: content,
          html: content,
        });
      });
    }
    return token;
  }

  // check token
  @Post('check')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Check token')
  checkToken(): string {
    return 'ok';
  }

  // refresh token
  @Post('renewal')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Renewal token')
  renewalToken(): TokenResult {
    return this.authService.createToken();
  }

  @Get('admin')
  @Responser.handle('Get admin profile')
  getAdminProfile(): Promise<Admin> {
    return this.authService.getAdminProfile();
  }

  @Put('admin')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update admin profile')
  putAdminProfile(@Body() adminProfile: AdminUpdateDTO): Promise<Admin> {
    return this.authService.putAdminProfile(adminProfile);
  }
}
