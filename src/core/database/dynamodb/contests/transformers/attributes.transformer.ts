import { DefaultAttrsTransformer } from './attrs/default-transformer';
import { ByDateAttrsTransformer } from './attrs/byDate-transformer';

export class AttrsTransformer extends DefaultAttrsTransformer {
  public readonly byDate: ByDateAttrsTransformer;
  constructor() {
    super();
    this.byDate = new ByDateAttrsTransformer(this);
    // This is the default transformer it self
  }
}
