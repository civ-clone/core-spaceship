"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalData = void 0;
const SpaceshipRegistry_1 = require("../SpaceshipRegistry");
const AdditionalData_1 = require("@civ-clone/core-data-object/AdditionalData");
const Player_1 = require("@civ-clone/core-player/Player");
const getAdditionalData = (spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    new AdditionalData_1.default(Player_1.default, 'spaceship', (player) => spaceshipRegistry.getActiveByPlayer(player)),
];
exports.getAdditionalData = getAdditionalData;
exports.default = exports.getAdditionalData;
//# sourceMappingURL=spaceship.js.map