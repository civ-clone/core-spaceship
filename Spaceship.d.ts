import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import Part from './Part';
import Player from '@civ-clone/core-player/Player';
export interface ISpaceship extends IDataObject {
  add(part: Part): void;
  check(): void;
  flightTime(): number;
  launch(): void;
  launched(): false | number;
  parts(): Part[];
  player(): Player;
  successful(): boolean | null;
}
export declare class Spaceship extends DataObject implements ISpaceship {
  #private;
  constructor(
    player: Player,
    ruleRegistry?: RuleRegistry,
    turn?: Turn,
    randomNumberGenerator?: () => number
  );
  add(part: Part): void;
  check(): void;
  /**
   * Returns the number of turns the flight is estimated to take.
   */
  flightTime(): number;
  launch(): void;
  launched(): false | number;
  parts(): Part[];
  player(): Player;
  successful(): boolean | null;
}
export default Spaceship;
