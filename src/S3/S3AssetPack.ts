import { S3Model } from './S3Model'

export class S3AssetPack extends S3Model {
  constructor(id: string) {
    super(id)
    this.type = 'asset_packs'
  }
}
