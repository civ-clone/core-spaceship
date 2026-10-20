import ChanceOfSuccess from '../Rules/ChanceOfSuccess';
import Effect from '@civ-clone/core-rule/Effect';
import FlightTime from '../Rules/FlightTime';
import Landed from '../Rules/Landed';
import Layout from '../Layout';
import Lost from '../Rules/Lost';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Spaceship from '../Spaceship';
import SpaceshipRegistry from '../SpaceshipRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '@civ-clone/core-game-year/Year';
import YearRule from '@civ-clone/core-game-year/Rules/Year';
import { expect } from 'chai';

// A ship with an empty layout, a two-year flight, one year a turn, and no chance of success at all.
const setUp = () => {
  const rules = new RuleRegistry(),
    turn = new Turn(),
    year = new Year(turn, rules),
    player = new Player(rules),
    landed: Spaceship[] = [],
    lost: Spaceship[] = [];

  rules.register(
    new YearRule(new Effect((turn: number) => turn)),
    new FlightTime(new Effect(() => 2)),
    new ChanceOfSuccess(new Effect(() => 0)),
    new Landed(new Effect((spaceship: Spaceship) => landed.push(spaceship))),
    new Lost(new Effect((spaceship: Spaceship) => lost.push(spaceship)))
  );

  const spaceship = new Spaceship(
    player,
    new Layout(0, 0, [], rules),
    rules,
    turn,
    year
  );

  return { landed, lost, player, spaceship, turn };
};

describe('Spaceship', (): void => {
  it('always lands when it arrives, whatever its chance of success', (): void => {
    const { landed, lost, spaceship, turn } = setUp();

    turn.set(10);
    spaceship.launch();

    turn.set(11);
    spaceship.check();

    expect(landed).to.deep.equal([]);
    expect(spaceship.successful()).to.equal(null);

    turn.set(12);
    spaceship.check();
    spaceship.check();

    expect(landed).to.deep.equal([spaceship]);
    expect(lost).to.deep.equal([]);
    expect(spaceship.successful()).to.equal(true);
  });

  it('can be lost while it is being built, or in flight, but only once and not after landing', (): void => {
    const built = setUp();

    built.spaceship.lose();
    built.spaceship.lose();

    expect(built.lost).to.deep.equal([built.spaceship]);
    expect(built.spaceship.successful()).to.equal(false);

    const flying = setUp();

    flying.spaceship.launch();
    flying.spaceship.lose();

    flying.turn.set(5);
    flying.spaceship.check();

    expect(flying.lost).to.deep.equal([flying.spaceship]);
    expect(flying.landed).to.deep.equal([]);

    const arrived = setUp();

    arrived.spaceship.launch();
    arrived.turn.set(5);
    arrived.spaceship.check();
    arrived.spaceship.lose();

    expect(arrived.lost).to.deep.equal([]);
    expect(arrived.spaceship.successful()).to.equal(true);
  });
});

describe('SpaceshipRegistry', (): void => {
  it("gives a player's ship that is being built or in flight, and not one lost or landed", (): void => {
    const { player, spaceship, turn } = setUp(),
      registry = new SpaceshipRegistry();

    registry.register(spaceship);

    expect(registry.getActiveByPlayer(player)).to.equal(spaceship);

    spaceship.launch();

    expect(registry.getActiveByPlayer(player)).to.equal(spaceship);

    turn.set(5);
    spaceship.check();

    expect(registry.getActiveByPlayer(player)).to.equal(null);

    const lost = setUp();

    registry.register(lost.spaceship);
    lost.spaceship.lose();

    expect(registry.getActiveByPlayer(lost.player)).to.equal(null);
  });
});
