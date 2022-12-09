import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import Player from '@civ-clone/core-player/Player';
import Spaceship from './Spaceship';
export interface ISpaceshipRegistry extends IEntityRegistry<Spaceship> {
  getActiveByPlayer(player: Player): Spaceship | null;
}
export declare class SpaceshipRegistry
  extends EntityRegistry<Spaceship>
  implements ISpaceshipRegistry
{
  constructor();
  getActiveByPlayer(player: Player): Spaceship | null;
}
export declare const instance: SpaceshipRegistry;
export default SpaceshipRegistry;
