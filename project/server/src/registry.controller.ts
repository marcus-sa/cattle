// https://registry.npmjs.org/yarn/-/yarn-0.15.1.tgz

import { Controller, Get, Header, HttpService, Inject, Param } from '@nestjs/common';
import { pluck } from 'rxjs/operators';
import * as fs from 'fs-extra';
import * as path from 'path';

import { IPFS_NODE } from './tokens';

@Controller('registry')
export class RegistryController {

  constructor(
    @Inject(IPFS_NODE)
    private readonly node: any,
    private readonly http: HttpService,
  ) {}

  private getNpmRegistry(pkg: string, version: string) {
    return `https://registry.npmjs.org/${pkg}/-/${pkg}-${version}.tgz`;
  }

  // @TODO: Fix broken archive
  @Get(':package-:version.tgz')
  @Header('Content-Type', 'application/x-gzip')
  @Header('Content-Encoding', 'identity')
  async getPackage(
    @Param('package') pkg: string,
    @Param('version') version: string,
  ) {
    const registryPath = path.join(__dirname, 'registry.json');
    const registry = await fs.readJSON(registryPath);
    const tarballUrl = this.getNpmRegistry(pkg, version);
    const pkgVer = `${pkg}-${version}`;
    const hash = registry[pkgVer];

    if (!hash) {
      const tarBall = await this.http.get(tarballUrl)
        .pipe(
          pluck('data'),
        ).toPromise();

      const filesAdded = await this.node.files.add({
        path: `${pkgVer}.tgz`,
        content: Buffer.from(<string>tarBall),
      });

      console.log(filesAdded);

      await fs.writeJSON(registryPath, {
        ...registry,
        [pkgVer]: filesAdded[0].hash,
      });

      return tarBall;
    } else {
      return (await this.node.files.cat(hash)).toString('utf8');
    }
  }

}