import Rule from '@civ-clone/core-rule/Rule';
import Part from '../Part';
import YieldValue from '@civ-clone/core-yield/Yield';

export class Yield extends Rule<[Part, YieldValue], YieldValue> {}

export default Yield;
