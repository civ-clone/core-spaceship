import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import { Year } from '@civ-clone/core-game-year/Year';
import Layout from './Layout';
import Part from './Part';
import Player from '@civ-clone/core-player/Player';
import Yield from '@civ-clone/core-yield/Yield';
export interface ISpaceship extends IDataObject {
  activeParts(): Part[];
  add(part: Part): void;
  chanceOfSuccess(): number;
  check(): void;
  lose(): void;
  flightTime(): number;
  inactiveParts(): Part[];
  launch(): boolean;
  launchable(): boolean;
  launched(): false | number;
  layout(): Layout;
  player(): Player;
  successful(): boolean | null;
  yields(): Yield[];
}
export declare class Spaceship extends DataObject implements ISpaceship {
  static readonly transient: string[];
  private _landingTurn;
  private _launched;
  private _layout;
  private _player;
  private _ruleRegistry;
  private _successful;
  private _turn;
  private _year;
  constructor(
    player: Player,
    layout: Layout,
    ruleRegistry?: RuleRegistry,
    turn?: Turn,
    year?: Year
  );
  activeParts(): Part[];
  add(part: Part): void;
  chanceOfSuccess(): number;
  check(): void;
  /**
   * Returns the number of years the flight is estimated to take.
   */
  flightTime(): number;
  inactiveParts(): Part[];
  /**
   * The ship is lost: one being built is cancelled, and one in flight never arrives. Its owner losing their capital,
   * say.
   */
  lose(): void;
  /**
   * Launches the ship, unless a `Launchable` rule says it may not go yet (`launchable()`): then nothing happens. Whether
   * it launched.
   */
  launch(): boolean;
  /**
   * Whether the ship may launch now: every `Launchable` rule agrees, as a ruleset that needs a part on board first
   * would have it. With no such rule, it may. Not sent to clients: a ruleset's action rule can ask it.
   */
  launchable(): boolean;
  launched(): false | number;
  layout(): Layout;
  player(): Player;
  successful(): boolean | null;
  yields(): Yield[];
}
export default Spaceship;
