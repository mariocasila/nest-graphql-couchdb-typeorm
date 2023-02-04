import { Module } from '@nestjs/common';
import { NanoService } from './nano.service';

@Module({
  providers: [NanoService],
  exports: [NanoService],
})
export class NanoModule {}
