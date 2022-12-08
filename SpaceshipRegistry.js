"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.SpaceshipRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
class SpaceshipRegistry extends EntityRegistry_1.EntityRegistry {
    getByPlayer(player) {
        const [spaceship] = this.getBy('player', player).filter((spaceship) => spaceship.launched() === false || spaceship.successful() === null);
        if (!spaceship) {
            throw new TypeError(`Wrong number of Spaceships for player ${player.id()}.`);
        }
        return spaceship;
    }
}
exports.SpaceshipRegistry = SpaceshipRegistry;
exports.instance = new SpaceshipRegistry();
exports.default = SpaceshipRegistry;
//# sourceMappingURL=SpaceshipRegistry.js.map