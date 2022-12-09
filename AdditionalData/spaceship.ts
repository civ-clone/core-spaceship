import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '../SpaceshipRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
import Player from '@civ-clone/core-player/Player';

export const getAdditionalData = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
) => [
  new AdditionalData(Player, 'spaceship', (player: Player) =>
    spaceshipRegistry.getActiveByPlayer(player)
  ),
];

export default getAdditionalData;
