import { instance as additionalDataRegistryInstance } from '@civ-clone/core-data-object/AdditionalDataRegistry';
import spaceship from './AdditionalData/spaceship';

additionalDataRegistryInstance.register(...spaceship());
