import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import Layout from './Layout';
import Part from './Part';
import Player from '@civ-clone/core-player/Player';
import Yield from '@civ-clone/core-yield/Yield';
export interface ISpaceship extends IDataObject {
  add(part: Part): void;
  chanceOfSuccess(): number;
  check(): void;
  flightTime(): number;
  launch(): void;
  launched(): false | number;
  layout(): Layout;
  parts(): Part[];
  player(): Player;
  successful(): boolean | null;
  yields(): Yield[];
}
export declare class Spaceship extends DataObject implements ISpaceship {
  #private;
  constructor(
    player: Player,
    layout: Layout,
    ruleRegistry?: RuleRegistry,
    turn?: Turn,
    randomNumberGenerator?: () => number
  );
  add(part: Part): void;
  chanceOfSuccess(): number;
  check(): void;
  /**
   * Returns the number of turns the flight is estimated to take.
   */
  flightTime(): number;
  launch(): void;
  launched(): false | number;
  layout(): Layout;
  parts(): Part[];
  player(): Player;
  successful(): boolean | null;
  yields(): Yield[];
}
export default Spaceship;
