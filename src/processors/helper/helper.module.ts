import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoogleService } from './helper.service.google';
import { AWSService } from './helper.service.aws';
import { EmailService } from './helper.service.email';
import { IPService } from './helper.service.ip';
import { SeoService } from './helper.service.seo';

const services = [
  GoogleService,
  AWSService,
  EmailService,
  IPService,
  SeoService,
];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
