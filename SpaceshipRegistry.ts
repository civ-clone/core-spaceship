import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import Player from '@civ-clone/core-player/Player';
import Spaceship from './Spaceship';

export interface ISpaceshipRegistry extends IEntityRegistry<Spaceship> {
  getActiveByPlayer(player: Player): Spaceship | null;
}

export class SpaceshipRegistry
  extends EntityRegistry<Spaceship>
  implements ISpaceshipRegistry
{
  constructor() {
    super(Spaceship);
  }

  getActiveByPlayer(player: Player): Spaceship | null {
    const [spaceship] = this.getBy('player', player).filter(
      (spaceship) =>
        spaceship.launched() === false || spaceship.successful() === null
    );

    if (!spaceship) {
      return null;
    }

    return spaceship;
  }
}

export const instance = new SpaceshipRegistry();

export default SpaceshipRegistry;
