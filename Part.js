"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Buildable_1 = require("@civ-clone/core-city-build/Buildable");
const Yield_1 = require("./Rules/Yield");
class Part extends Buildable_1.default {
    constructor(city, ruleRegistry = RuleRegistry_1.instance) {
        super();
        this._city = city;
        this._ruleRegistry = ruleRegistry;
        this.addKey('city', 'yields');
    }
    static build(city, ruleRegistry = RuleRegistry_1.instance) {
        return new this(city, ruleRegistry);
    }
    city() {
        return this._city;
    }
    yields() {
        return this._ruleRegistry.process(Yield_1.default, this).flat();
    }
}
exports.Part = Part;
exports.default = Part;
//# sourceMappingURL=Part.js.map