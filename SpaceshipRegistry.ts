import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import Player from '@civ-clone/core-player/Player';
import Spaceship from './Spaceship';

export interface ISpaceshipRegistry extends IEntityRegistry<Spaceship> {
  getByPlayer(player: Player): Spaceship;
}

export class SpaceshipRegistry
  extends EntityRegistry<Spaceship>
  implements ISpaceshipRegistry
{
  getByPlayer(player: Player): Spaceship {
    const [spaceship] = this.getBy('player', player).filter(
      (spaceship) =>
        spaceship.launched() === false || spaceship.successful() === null
    );

    if (!spaceship) {
      throw new TypeError(
        `Wrong number of Spaceships for player ${player.id()}.`
      );
    }

    return spaceship;
  }
}

export const instance = new SpaceshipRegistry();

export default SpaceshipRegistry;
