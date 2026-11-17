import Active from '../Rules/Active';
import ChooseSlot from '../Rules/ChooseSlot';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import FlightTime from '../Rules/FlightTime';
import Landed from '../Rules/Landed';
import Launch from '../Rules/Launch';
import Launchable from '../Rules/Launchable';
import Layout from '../Layout';
import Lost from '../Rules/Lost';
import Part from '../Part';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Slot from '../Slot';
import Spaceship from '../Spaceship';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '@civ-clone/core-game-year/Year';
import YearKey from '@civ-clone/core-game-year/Rules/YearKey';
import YearRule from '@civ-clone/core-game-year/Rules/Year';
import { expect } from 'chai';

// A toy ruleset, to show what core lets a ruleset say: structurals that limit how many other parts count, a part
//  needed on board before launch, a calendar that slows to a year a turn once a ship launches, and a ship lost in
//  flight told apart from one lost while being built.
class Structural extends Part {}
class Habitation extends Part {}

const city = {} as City;

const setUp = () => {
  const rules = new RuleRegistry(),
    turn = new Turn(),
    year = new Year(turn, rules),
    player = new Player(rules),
    launches: number[] = [],
    lost: [Spaceship, boolean][] = [],
    landed: Spaceship[] = [],
    slots = [
      ...[0, 1, 2, 3].map((x) => new Slot(x, 0, 1, 1, [Structural])),
      ...[0, 1].map((x) => new Slot(x, 1, 1, 1, [Habitation])),
    ],
    layout = new Layout(2, 4, slots, rules),
    built = (PartType: typeof Part): number =>
      layout
        .slots()
        .filter((slot: Slot): boolean => slot.part() instanceof PartType)
        .length;

  rules.register(
    // 10 years a turn until a ship launches, then 1.
    new YearRule(
      new Effect((turnNumber: number): number => {
        const [launched = Infinity] = launches;

        return turnNumber <= launched
          ? turnNumber * 10
          : launched * 10 + (turnNumber - launched);
      })
    ),
    new YearKey(new Effect((): string => launches.join(','))),
    new Launch(
      new Effect((): void => {
        launches.push(turn.value());
      })
    ),
    new FlightTime(new Effect((): number => 3)),
    new ChooseSlot(
      new Effect(
        (part: Part, layout: Layout): Slot =>
          layout
            .slots()
            .find((slot: Slot): boolean => slot.empty() && slot.accepts(part))!
      )
    ),
    // A filled slot counts; a habitation counts only one for each two structurals built.
    new Active(new Effect((slot: Slot): boolean => slot.part() !== null)),
    new Active(
      new Criterion((slot: Slot): boolean => slot.part() instanceof Habitation),
      new Effect(
        (slot: Slot, layout: Layout): boolean =>
          layout
            .slots()
            .filter(
              (other: Slot): boolean => other.part() instanceof Habitation
            )
            .indexOf(slot) < Math.floor(built(Structural) / 2)
      )
    ),
    // At least one habitation on board.
    new Launchable(
      new Effect((spaceship: Spaceship): boolean =>
        spaceship
          .activeParts()
          .some((part: Part): boolean => part instanceof Habitation)
      )
    ),
    new Lost(
      new Effect((spaceship: Spaceship): void => {
        lost.push([spaceship, spaceship.launched() !== false]);
      })
    ),
    new Landed(new Effect((spaceship: Spaceship) => landed.push(spaceship)))
  );

  const spaceship = new Spaceship(player, layout, rules, turn, year);

  return { landed, lost, rules, spaceship, turn, year };
};

describe('a ruleset on core-spaceship', (): void => {
  it('limits the parts that count by the structurals built', (): void => {
    const { rules, spaceship } = setUp();

    spaceship.add(new Habitation(city, rules));
    spaceship.add(new Habitation(city, rules));
    spaceship.add(new Structural(city, rules));

    expect(spaceship.activeParts().length).to.equal(1);
    expect(spaceship.inactiveParts().length).to.equal(2);

    spaceship.add(new Structural(city, rules));

    expect(
      spaceship
        .activeParts()
        .filter((part: Part): boolean => part instanceof Habitation).length
    ).to.equal(1);

    spaceship.add(new Structural(city, rules));
    spaceship.add(new Structural(city, rules));

    expect(spaceship.activeParts().length).to.equal(6);
    expect(spaceship.inactiveParts()).to.deep.equal([]);
  });

  it("won't launch until its rules agree, and with none, launches as before", (): void => {
    const { rules, spaceship, turn } = setUp();

    turn.set(5);

    expect(spaceship.launchable()).to.equal(false);
    expect(spaceship.launch()).to.equal(false);
    expect(spaceship.launched()).to.equal(false);

    spaceship.add(new Structural(city, rules));
    spaceship.add(new Structural(city, rules));
    spaceship.add(new Habitation(city, rules));

    expect(spaceship.launchable()).to.equal(true);
    expect(spaceship.launch()).to.equal(true);
    expect(spaceship.launched()).to.equal(5);

    const plain = new RuleRegistry(),
      plainTurn = new Turn(),
      ship = new Spaceship(
        new Player(plain),
        new Layout(0, 0, [], plain),
        plain,
        plainTurn,
        new Year(plainTurn, plain)
      );

    plain.register(
      new YearRule(new Effect((turn: number) => turn)),
      new FlightTime(new Effect((): number => 2))
    );

    expect(ship.launchable()).to.equal(true);
    expect(ship.launch()).to.equal(true);
    expect(ship.launched()).to.equal(plainTurn.value());
  });

  it('lands on the turn the calendar its Launch rules set says, and never fails on arrival', (): void => {
    const { landed, rules, spaceship, turn, year } = setUp();

    spaceship.add(new Structural(city, rules));
    spaceship.add(new Structural(city, rules));
    spaceship.add(new Habitation(city, rules));

    turn.set(5);

    // Before the launch, 10 years a turn: a 3-year flight would land next turn.
    expect(year.value(6)).to.equal(60);

    spaceship.launch();

    // After it, a year a turn: 50 + 3 is turn 8.
    expect(year.value(6)).to.equal(51);

    turn.set(7);
    spaceship.check();

    expect(landed).to.deep.equal([]);

    turn.set(8);
    spaceship.check();

    expect(landed).to.deep.equal([spaceship]);
    expect(spaceship.successful()).to.equal(true);
  });

  it('tells a ship recalled in flight from one lost being built', (): void => {
    const building = setUp();

    building.spaceship.lose();

    const flying = setUp();

    flying.spaceship.add(new Structural(city, flying.rules));
    flying.spaceship.add(new Structural(city, flying.rules));
    flying.spaceship.add(new Habitation(city, flying.rules));
    flying.spaceship.launch();
    flying.spaceship.lose();

    expect(building.lost).to.deep.equal([[building.spaceship, false]]);
    expect(flying.lost).to.deep.equal([[flying.spaceship, true]]);
    expect(flying.spaceship.successful()).to.equal(false);
  });
});
