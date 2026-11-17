import Rule from '@civ-clone/core-rule/Rule';
import Spaceship from '../Spaceship';

// Whether the ship may launch now: every rule must agree. With none registered, any ship may.
export class Launchable extends Rule<[Spaceship], boolean> {}

export default Launchable;
