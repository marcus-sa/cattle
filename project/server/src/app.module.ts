import { HttpModule, Module } from '@nestjs/common';

import { RegistryController } from './registry.controller';
import { IpfsService } from './ipfs.service';
import { IPFS_NODE } from './tokens';

@Module({
  imports: [HttpModule],
  controllers: [RegistryController],
  providers: [
    {
      provide: IPFS_NODE,
      useValue: new (require('ipfs'))(),
    },
    IpfsService,
  ],
})
export class AppModule {}