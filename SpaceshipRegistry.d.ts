import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import Player from '@civ-clone/core-player/Player';
import Spaceship from './Spaceship';
export interface ISpaceshipRegistry extends IEntityRegistry<Spaceship> {
  getByPlayer(player: Player): Spaceship;
}
export declare class SpaceshipRegistry
  extends EntityRegistry<Spaceship>
  implements ISpaceshipRegistry
{
  getByPlayer(player: Player): Spaceship;
}
export declare const instance: SpaceshipRegistry;
export default SpaceshipRegistry;
