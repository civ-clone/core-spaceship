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
import ChanceOfSuccess from './Rules/ChanceOfSuccess';
import FlightTime from './Rules/FlightTime';
import Landed from './Rules/Landed';
import Launch from './Rules/Launch';
import Lost from './Rules/Lost';
import Part from './Part';
import PartBuilt from './Rules/PartBuilt';
import Player from '@civ-clone/core-player/Player';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from './Rules/Yield';

export interface ISpaceship extends IDataObject {
  add(part: Part): void;
  check(): void;
  flightTime(): number;
  launch(): void;
  launched(): false | number;
  parts(): Part[];
  player(): Player;
  successful(): boolean | null;
  yield(yields: Yield[]): Yield[];
}

export class Spaceship extends DataObject implements ISpaceship {
  #launched: false | number = false;
  #parts: Part[] = [];
  #player: Player;
  #randomNumberGenerator: () => number;
  #ruleRegistry: RuleRegistry;
  #successful: boolean | null = null;
  #turn: Turn;

  constructor(
    player: Player,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    turn: Turn = turnInstance,
    randomNumberGenerator: () => number = () => Math.random()
  ) {
    super();

    this.#player = player;
    this.#ruleRegistry = ruleRegistry;
    this.#turn = turn;
    this.#randomNumberGenerator = randomNumberGenerator;

    this.addKey('flightTime', 'launched', 'parts', 'player', 'successful');
  }

  add(part: Part): void {
    if (this.#launched) {
      return;
    }

    this.#parts.push(part);
    this.#ruleRegistry.process(PartBuilt, part, this);
  }

  check(): void {
    if (
      this.#successful !== null ||
      this.#launched === false ||
      this.#launched + this.flightTime() < this.#turn.value()
    ) {
      return;
    }

    const chanceOfSuccess = Math.max(
      ...this.#ruleRegistry.process(ChanceOfSuccess, this),
      0
    );

    this.#successful = chanceOfSuccess > this.#randomNumberGenerator();

    if (this.#successful) {
      this.#ruleRegistry.process(Landed, this);

      return;
    }

    this.#ruleRegistry.process(Lost, this);
  }

  /**
   * Returns the number of turns the flight is estimated to take.
   */
  flightTime(): number {
    return Math.min(...this.#ruleRegistry.process(FlightTime, this), Infinity);
  }

  launch(): void {
    this.#ruleRegistry.process(Launch, this);

    this.#launched = this.#turn.value();
  }

  launched(): false | number {
    return this.#launched;
  }

  parts(): Part[] {
    return this.#parts;
  }

  player(): Player {
    return this.#player;
  }

  successful(): boolean | null {
    return this.#successful;
  }

  yield(yields: Yield[]): Yield[] {
    yields.forEach((shipYield: Yield): void =>
      this.#parts.forEach((part) => {
        const partYield = shipYield.clone();

        partYield.set(0);

        this.#ruleRegistry.process(YieldRule, part, partYield);

        shipYield.add(partYield);
      })
    );

    return yields;
  }
}

export default Spaceship;
