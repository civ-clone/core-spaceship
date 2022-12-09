import Part from '../Part';
import Rule from '@civ-clone/core-rule/Rule';
import Spaceship from '../Spaceship';

export class Validate extends Rule<[Part, Spaceship], boolean> {}

export default Validate;
