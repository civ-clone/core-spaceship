import Layout from '../Layout';
import Rule from '@civ-clone/core-rule/Rule';
import Slot from '../Slot';

export class Active extends Rule<[Slot, Layout], boolean> {}

export default Active;
