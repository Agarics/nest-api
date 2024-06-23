import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AWSService } from './helper.service.aws';
import { EmailService } from './helper.service.email';
import { IPService } from './helper.service.ip';

const services = [AWSService, EmailService, IPService];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
