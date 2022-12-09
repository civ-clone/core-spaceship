import Part from '../Part';
import Rule from '@civ-clone/core-rule/Rule';
import Spaceship from '../Spaceship';

export class Built extends Rule<[Part, Spaceship], void> {}

export default Built;
