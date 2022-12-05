import Part from '../Part';
import Rule from '@civ-clone/core-rule/Rule';
import Spaceship from '../Spaceship';

export class PartBuilt extends Rule<[Part, Spaceship], void> {}

export default PartBuilt;
