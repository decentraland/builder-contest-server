import { S3Model } from './S3Model'

export class S3Project extends S3Model {
  constructor(id: string) {
    super(id)
    this.type = 'projects'
  }
}
