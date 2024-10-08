/**
 * @file Archive controller
 */

import { UseGuards, Controller, Get, Patch } from '@nestjs/common';
import { AdminOnlyGuard } from '@/guards/admin-only.guard';
import { Responser } from '@/decorators/responser.decorator';
import { ArchiveService, ArchiveData } from './archive.service';

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  @Responser.handle('Get archive')
  getArchive(): Promise<ArchiveData> {
    return this.archiveService.getCache();
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update archive cache')
  updateArchive(): Promise<any> {
    return this.archiveService.updateCache();
  }
}
