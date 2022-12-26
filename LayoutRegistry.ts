import ConstructorRegistry from '@civ-clone/core-registry/ConstructorRegistry';
import Layout from './Layout';

export class LayoutRegistry extends ConstructorRegistry<Layout> {
  constructor() {
    super(Layout);
  }
}

export const instance = new LayoutRegistry();

export default LayoutRegistry;
