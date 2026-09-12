import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import { Year, instance as yearInstance } from '@civ-clone/core-game-year/Year';
import Built from './Rules/Built';
import ChanceOfSuccess from './Rules/ChanceOfSuccess';
import ChooseSlot from './Rules/ChooseSlot';
import FlightTime from './Rules/FlightTime';
import Landed from './Rules/Landed';
import Launch from './Rules/Launch';
import Layout from './Layout';
import Lost from './Rules/Lost';
import Part from './Part';
import Player from '@civ-clone/core-player/Player';
import Slot from './Slot';
import Yield from '@civ-clone/core-yield/Yield';
import { instance as rngInstance } from '@civ-clone/core-random';

export interface ISpaceship extends IDataObject {
  activeParts(): Part[];
  add(part: Part): void;
  chanceOfSuccess(): number;
  check(): void;
  flightTime(): number;
  inactiveParts(): Part[];
  launch(): void;
  launched(): false | number;
  layout(): Layout;
  player(): Player;
  successful(): boolean | null;
  yields(): Yield[];
}

export class Spaceship extends DataObject implements ISpaceship {
  private _landingTurn: number = Infinity;
  private _launched: false | number = false;
  private _layout: Layout;
  private _player: Player;
  private _randomNumberGenerator: () => number;
  private _ruleRegistry: RuleRegistry;
  private _successful: boolean | null = null;
  private _turn: Turn;
  private _year: Year;

  constructor(
    player: Player,
    layout: Layout,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    turn: Turn = turnInstance,
    year: Year = yearInstance,
    randomNumberGenerator: () => number = rngInstance
  ) {
    super();

    this._player = player;
    this._layout = layout;
    this._ruleRegistry = ruleRegistry;
    this._turn = turn;
    this._year = year;
    this._randomNumberGenerator = randomNumberGenerator;

    this.addKey(
      'activeParts',
      'chanceOfSuccess',
      'flightTime',
      'inactiveParts',
      'launched',
      'layout',
      'player',
      'successful',
      'yields'
    );
  }

  activeParts(): Part[] {
    return this._layout
      .activeSlots()
      .filter((slot: Slot) => !slot.empty())
      .map((slot: Slot) => slot.part()!);
  }

  add(part: Part): void {
    const [slot] = this._ruleRegistry.process(ChooseSlot, part, this._layout);

    if (!slot) {
      return;
    }

    slot.fill(part);
    this._ruleRegistry.process(Built, part, this);
  }

  chanceOfSuccess(): number {
    return Math.max(...this._ruleRegistry.process(ChanceOfSuccess, this), 0);
  }

  check(): void {
    if (
      this._successful !== null ||
      this._launched === false ||
      this._turn.value() < this._landingTurn
    ) {
      return;
    }

    this._successful = this.chanceOfSuccess() > this._randomNumberGenerator();

    if (this._successful) {
      this._ruleRegistry.process(Landed, this);

      return;
    }

    this._ruleRegistry.process(Lost, this);
  }

  /**
   * Returns the number of years the flight is estimated to take.
   */
  flightTime(): number {
    return Math.min(...this._ruleRegistry.process(FlightTime, this), Infinity);
  }

  inactiveParts(): Part[] {
    return this._layout
      .inactiveSlots()
      .filter((slot: Slot) => !slot.empty())
      .map((slot: Slot) => slot.part()!);
  }

  launch(): void {
    this._ruleRegistry.process(Launch, this);

    this._landingTurn = this._launched = this._turn.value();

    const years = this.flightTime(),
      targetYear = this._year.value() + years;

    // convert to whole `Turn`s
    while (this._year.value(this._landingTurn) < targetYear) {
      this._landingTurn++;
    }
  }

  launched(): false | number {
    return this._launched;
  }

  layout(): Layout {
    return this._layout;
  }

  player(): Player {
    return this._player;
  }

  successful(): boolean | null {
    return this._successful;
  }

  yields(): Yield[] {
    return this.activeParts().flatMap((part: Part) => part.yields());
  }
}

export default Spaceship;
