import EntityRegistry from '@civ-clone/core-registry/EntityRegistry';
import Layout from './Layout';

export class LayoutRegistry extends EntityRegistry<Layout> {
  constructor() {
    super(Layout);
  }
}

export const instance = new LayoutRegistry();

export default LayoutRegistry;
