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
var _Spaceship_landingTurn, _Spaceship_launched, _Spaceship_layout, _Spaceship_player, _Spaceship_randomNumberGenerator, _Spaceship_ruleRegistry, _Spaceship_successful, _Spaceship_turn, _Spaceship_year;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spaceship = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("@civ-clone/core-game-year/Year");
const Built_1 = require("./Rules/Built");
const ChanceOfSuccess_1 = require("./Rules/ChanceOfSuccess");
const ChooseSlot_1 = require("./Rules/ChooseSlot");
const FlightTime_1 = require("./Rules/FlightTime");
const Landed_1 = require("./Rules/Landed");
const Launch_1 = require("./Rules/Launch");
const Lost_1 = require("./Rules/Lost");
class Spaceship extends DataObject_1.DataObject {
    constructor(player, layout, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, year = Year_1.instance, randomNumberGenerator = () => Math.random()) {
        super();
        _Spaceship_landingTurn.set(this, Infinity);
        _Spaceship_launched.set(this, false);
        _Spaceship_layout.set(this, void 0);
        _Spaceship_player.set(this, void 0);
        _Spaceship_randomNumberGenerator.set(this, void 0);
        _Spaceship_ruleRegistry.set(this, void 0);
        _Spaceship_successful.set(this, null);
        _Spaceship_turn.set(this, void 0);
        _Spaceship_year.set(this, void 0);
        __classPrivateFieldSet(this, _Spaceship_player, player, "f");
        __classPrivateFieldSet(this, _Spaceship_layout, layout, "f");
        __classPrivateFieldSet(this, _Spaceship_ruleRegistry, ruleRegistry, "f");
        __classPrivateFieldSet(this, _Spaceship_turn, turn, "f");
        __classPrivateFieldSet(this, _Spaceship_year, year, "f");
        __classPrivateFieldSet(this, _Spaceship_randomNumberGenerator, randomNumberGenerator, "f");
        this.addKey('activeParts', 'chanceOfSuccess', 'flightTime', 'inactiveParts', 'launched', 'layout', 'player', 'successful', 'yields');
    }
    activeParts() {
        return __classPrivateFieldGet(this, _Spaceship_layout, "f")
            .activeSlots()
            .filter((slot) => !slot.empty())
            .map((slot) => slot.part());
    }
    add(part) {
        const [slot] = __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(ChooseSlot_1.default, part, __classPrivateFieldGet(this, _Spaceship_layout, "f"));
        if (!slot) {
            return;
        }
        slot.fill(part);
        __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Built_1.default, part, this);
    }
    chanceOfSuccess() {
        return Math.max(...__classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(ChanceOfSuccess_1.default, this), 0);
    }
    check() {
        if (__classPrivateFieldGet(this, _Spaceship_successful, "f") !== null ||
            __classPrivateFieldGet(this, _Spaceship_launched, "f") === false ||
            __classPrivateFieldGet(this, _Spaceship_turn, "f").value() < __classPrivateFieldGet(this, _Spaceship_landingTurn, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _Spaceship_successful, this.chanceOfSuccess() > __classPrivateFieldGet(this, _Spaceship_randomNumberGenerator, "f").call(this), "f");
        if (__classPrivateFieldGet(this, _Spaceship_successful, "f")) {
            __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Landed_1.default, this);
            return;
        }
        __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Lost_1.default, this);
    }
    /**
     * Returns the number of years the flight is estimated to take.
     */
    flightTime() {
        return Math.min(...__classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(FlightTime_1.default, this), Infinity);
    }
    inactiveParts() {
        return __classPrivateFieldGet(this, _Spaceship_layout, "f")
            .inactiveSlots()
            .filter((slot) => !slot.empty())
            .map((slot) => slot.part());
    }
    launch() {
        var _a;
        __classPrivateFieldGet(this, _Spaceship_ruleRegistry, "f").process(Launch_1.default, this);
        __classPrivateFieldSet(this, _Spaceship_landingTurn, __classPrivateFieldSet(this, _Spaceship_launched, __classPrivateFieldGet(this, _Spaceship_turn, "f").value(), "f"), "f");
        const years = this.flightTime(), targetYear = __classPrivateFieldGet(this, _Spaceship_year, "f").value() + years;
        // convert to whole `Turn`s
        while (__classPrivateFieldGet(this, _Spaceship_year, "f").value(__classPrivateFieldGet(this, _Spaceship_landingTurn, "f")) < targetYear) {
            __classPrivateFieldSet(this, _Spaceship_landingTurn, (_a = __classPrivateFieldGet(this, _Spaceship_landingTurn, "f"), _a++, _a), "f");
        }
    }
    launched() {
        return __classPrivateFieldGet(this, _Spaceship_launched, "f");
    }
    layout() {
        return __classPrivateFieldGet(this, _Spaceship_layout, "f");
    }
    player() {
        return __classPrivateFieldGet(this, _Spaceship_player, "f");
    }
    successful() {
        return __classPrivateFieldGet(this, _Spaceship_successful, "f");
    }
    yields() {
        return this.activeParts().flatMap((part) => part.yields());
    }
}
exports.Spaceship = Spaceship;
_Spaceship_landingTurn = new WeakMap(), _Spaceship_launched = new WeakMap(), _Spaceship_layout = new WeakMap(), _Spaceship_player = new WeakMap(), _Spaceship_randomNumberGenerator = new WeakMap(), _Spaceship_ruleRegistry = new WeakMap(), _Spaceship_successful = new WeakMap(), _Spaceship_turn = new WeakMap(), _Spaceship_year = new WeakMap();
exports.default = Spaceship;
//# sourceMappingURL=Spaceship.js.map