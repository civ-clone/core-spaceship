import Layout from '../Layout';
import Part from '../Part';
import Rule from '@civ-clone/core-rule/Rule';
import Slot from '../Slot';

export class ChooseSlot extends Rule<[Part, Layout], Slot> {}

export default ChooseSlot;
