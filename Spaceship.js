"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Spaceship_launched, _Spaceship_parts, _Spaceship_player, _Spaceship_randomNumberGenerator, _Spaceship_ruleRegistry, _Spaceship_successful, _Spaceship_turn;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spaceship = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const ChanceOfSuccess_1 = require("./Rules/ChanceOfSuccess");
const FlightTime_1 = require("./Rules/FlightTime");
const Landed_1 = require("./Rules/Landed");
const Launch_1 = require("./Rules/Launch");
const Lost_1 = require("./Rules/Lost");
const PartBuilt_1 = require("./Rules/PartBuilt");
const Yield_1 = require("./Rules/Yield");
class Spaceship extends DataObject_1.DataObject {
    constructor(player, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, randomNumberGenerator = () => Math.random()) {
        super();
        _Spaceship_launched.set(this, false);
        _Spaceship_parts.set(this, []);
        _Spaceship_player.set(this, void 0);
        _Spaceship_randomNumberGenerator.set(this, void 0);
        _Spaceship_ruleRegistry.set(this, void 0);
        _Spaceship_successful.set(this, null);
        _Spaceship_turn.set(this, void 0);
        __classPrivateFieldSet(this, _Spaceship_player, player, "f");
        __classPrivateFieldSet(this, _Spaceship_ruleRegistry, ruleRegistry, "f");
        __classPrivateFieldSet(this, _Spaceship_turn, turn, "f");
        __classPrivateFieldSet(this, _Spaceship_randomNumberGenerator, randomNumberGenerator, "f");
        this.addKey('flightTime', 'launched', 'parts', 'player', 'successful');
    }
    add(part) {
        if (__classPrivateFieldGet(this, _Spaceship_launched, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _Spaceship_parts, "f").push(part);
        __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(PartBuilt_1.default, part, this);
    }
    check() {
        if (__classPrivateFieldGet(this, _Spaceship_successful, "f") !== null ||
            __classPrivateFieldGet(this, _Spaceship_launched, "f") === false ||
            __classPrivateFieldGet(this, _Spaceship_launched, "f") + this.flightTime() < __classPrivateFieldGet(this, _Spaceship_turn, "f").value()) {
            return;
        }
        const chanceOfSuccess = Math.max(...__classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(ChanceOfSuccess_1.default, this), 0);
        __classPrivateFieldSet(this, _Spaceship_successful, chanceOfSuccess > __classPrivateFieldGet(this, _Spaceship_randomNumberGenerator, "f").call(this), "f");
        if (__classPrivateFieldGet(this, _Spaceship_successful, "f")) {
            __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Landed_1.default, this);
            return;
        }
        __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Lost_1.default, this);
    }
    /**
     * Returns the number of turns the flight is estimated to take.
     */
    flightTime() {
        return Math.min(...__classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(FlightTime_1.default, this), Infinity);
    }
    launch() {
        __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Launch_1.default, this);
        __classPrivateFieldSet(this, _Spaceship_launched, __classPrivateFieldGet(this, _Spaceship_turn, "f").value(), "f");
    }
    launched() {
        return __classPrivateFieldGet(this, _Spaceship_launched, "f");
    }
    parts() {
        return __classPrivateFieldGet(this, _Spaceship_parts, "f");
    }
    player() {
        return __classPrivateFieldGet(this, _Spaceship_player, "f");
    }
    successful() {
        return __classPrivateFieldGet(this, _Spaceship_successful, "f");
    }
    yield(yields) {
        yields.forEach((shipYield) => __classPrivateFieldGet(this, _Spaceship_parts, "f").forEach((part) => {
            const partYield = shipYield.clone();
            partYield.set(0);
            __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Yield_1.default, part, partYield);
            shipYield.add(partYield);
        }));
        return yields;
    }
}
exports.Spaceship = Spaceship;
_Spaceship_launched = new WeakMap(), _Spaceship_parts = new WeakMap(), _Spaceship_player = new WeakMap(), _Spaceship_randomNumberGenerator = new WeakMap(), _Spaceship_ruleRegistry = new WeakMap(), _Spaceship_successful = new WeakMap(), _Spaceship_turn = new WeakMap();
exports.default = Spaceship;
//# sourceMappingURL=Spaceship.js.map