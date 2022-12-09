"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.SpaceshipRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
const Spaceship_1 = require("./Spaceship");
class SpaceshipRegistry extends EntityRegistry_1.EntityRegistry {
    constructor() {
        super(Spaceship_1.default);
    }
    getActiveByPlayer(player) {
        const [spaceship] = this.getBy('player', player).filter((spaceship) => spaceship.launched() === false || spaceship.successful() === null);
        if (!spaceship) {
            return null;
        }
        return spaceship;
    }
}
exports.SpaceshipRegistry = SpaceshipRegistry;
exports.instance = new SpaceshipRegistry();
exports.default = SpaceshipRegistry;
//# sourceMappingURL=SpaceshipRegistry.js.map