import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';

@Module({
  imports: [HttpModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
