"use strict";
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
const core_random_1 = require("@civ-clone/core-random");
class Spaceship extends DataObject_1.DataObject {
    constructor(player, layout, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, year = Year_1.instance, randomNumberGenerator = core_random_1.instance) {
        super();
        this._landingTurn = Infinity;
        this._launched = false;
        this._successful = null;
        this._player = player;
        this._layout = layout;
        this._ruleRegistry = ruleRegistry;
        this._turn = turn;
        this._year = year;
        this._randomNumberGenerator = randomNumberGenerator;
        this.addKey('activeParts', 'chanceOfSuccess', 'flightTime', 'inactiveParts', 'launched', 'layout', 'player', 'successful', 'yields');
    }
    activeParts() {
        return this._layout
            .activeSlots()
            .filter((slot) => !slot.empty())
            .map((slot) => slot.part());
    }
    add(part) {
        const [slot] = this._ruleRegistry.process(ChooseSlot_1.default, part, this._layout);
        if (!slot) {
            return;
        }
        slot.fill(part);
        this._ruleRegistry.process(Built_1.default, part, this);
    }
    chanceOfSuccess() {
        return Math.max(...this._ruleRegistry.process(ChanceOfSuccess_1.default, this), 0);
    }
    check() {
        if (this._successful !== null ||
            this._launched === false ||
            this._turn.value() < this._landingTurn) {
            return;
        }
        this._successful = this.chanceOfSuccess() > this._randomNumberGenerator();
        if (this._successful) {
            this._ruleRegistry.process(Landed_1.default, this);
            return;
        }
        this._ruleRegistry.process(Lost_1.default, this);
    }
    /**
     * Returns the number of years the flight is estimated to take.
     */
    flightTime() {
        return Math.min(...this._ruleRegistry.process(FlightTime_1.default, this), Infinity);
    }
    inactiveParts() {
        return this._layout
            .inactiveSlots()
            .filter((slot) => !slot.empty())
            .map((slot) => slot.part());
    }
    launch() {
        this._ruleRegistry.process(Launch_1.default, this);
        this._landingTurn = this._launched = this._turn.value();
        const years = this.flightTime(), targetYear = this._year.value() + years;
        // convert to whole `Turn`s
        while (this._year.value(this._landingTurn) < targetYear) {
            this._landingTurn++;
        }
    }
    launched() {
        return this._launched;
    }
    layout() {
        return this._layout;
    }
    player() {
        return this._player;
    }
    successful() {
        return this._successful;
    }
    yields() {
        return this.activeParts().flatMap((part) => part.yields());
    }
}
exports.Spaceship = Spaceship;
exports.default = Spaceship;
//# sourceMappingURL=Spaceship.js.map