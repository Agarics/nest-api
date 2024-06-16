import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

const services = [];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
