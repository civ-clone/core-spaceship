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
  #landingTurn: number = Infinity;
  #launched: false | number = false;
  #layout: Layout;
  #player: Player;
  #randomNumberGenerator: () => number;
  #ruleRegistry: RuleRegistry;
  #successful: boolean | null = null;
  #turn: Turn;
  #year: Year;

  constructor(
    player: Player,
    layout: Layout,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    turn: Turn = turnInstance,
    year: Year = yearInstance,
    randomNumberGenerator: () => number = () => Math.random()
  ) {
    super();

    this.#player = player;
    this.#layout = layout;
    this.#ruleRegistry = ruleRegistry;
    this.#turn = turn;
    this.#year = year;
    this.#randomNumberGenerator = randomNumberGenerator;

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
    return this.#layout
      .activeSlots()
      .filter((slot: Slot) => !slot.empty())
      .map((slot: Slot) => slot.part()!);
  }

  add(part: Part): void {
    const [slot] = this.#ruleRegistry.process(ChooseSlot, part, this.#layout);

    if (!slot) {
      return;
    }

    slot.fill(part);
    this.#ruleRegistry.process(Built, part, this);
  }

  chanceOfSuccess(): number {
    return Math.max(...this.#ruleRegistry.process(ChanceOfSuccess, this), 0);
  }

  check(): void {
    if (
      this.#successful !== null ||
      this.#launched === false ||
      this.#turn.value() < this.#landingTurn
    ) {
      return;
    }

    this.#successful = this.chanceOfSuccess() > this.#randomNumberGenerator();

    if (this.#successful) {
      this.#ruleRegistry.process(Landed, this);

      return;
    }

    this.#ruleRegistry.process(Lost, this);
  }

  /**
   * Returns the number of years the flight is estimated to take.
   */
  flightTime(): number {
    return Math.min(...this.#ruleRegistry.process(FlightTime, this), Infinity);
  }

  inactiveParts(): Part[] {
    return this.#layout
      .inactiveSlots()
      .filter((slot: Slot) => !slot.empty())
      .map((slot: Slot) => slot.part()!);
  }

  launch(): void {
    this.#ruleRegistry.process(Launch, this);

    this.#landingTurn = this.#launched = this.#turn.value();

    const years = this.flightTime(),
      targetYear = this.#year.value() + years;

    // convert to whole `Turn`s
    while (this.#year.value(this.#landingTurn) < targetYear) {
      this.#landingTurn++;
    }
  }

  launched(): false | number {
    return this.#launched;
  }

  layout(): Layout {
    return this.#layout;
  }

  player(): Player {
    return this.#player;
  }

  successful(): boolean | null {
    return this.#successful;
  }

  yields(): Yield[] {
    return this.activeParts().flatMap((part: Part) => part.yields());
  }
}

export default Spaceship;
