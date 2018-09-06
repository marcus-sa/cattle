import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { IPFS_NODE } from './tokens';

@Injectable()
export class IpfsService implements OnModuleInit, OnModuleDestroy {

  constructor(
    @Inject(IPFS_NODE)
    private readonly node: any,
  ) {}

  async onModuleDestroy() {
    await this.node.stop();
  }

  onModuleInit(): Promise<string> {
    return new Promise(resolve => {
      this.node.on('ready', async () => {
        const version = await this.node.version();

        resolve(version);
      });
    });
  }

}