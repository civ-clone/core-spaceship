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
var _Part_city, _Part_ruleRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Buildable_1 = require("@civ-clone/core-city-build/Buildable");
const Yield_1 = require("./Rules/Yield");
class Part extends Buildable_1.default {
    constructor(city, ruleRegistry = RuleRegistry_1.instance) {
        super();
        _Part_city.set(this, void 0);
        _Part_ruleRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _Part_city, city, "f");
        __classPrivateFieldSet(this, _Part_ruleRegistry, ruleRegistry, "f");
        this.addKey('city');
    }
    static build(city, ruleRegistry = RuleRegistry_1.instance) {
        return new this(city, ruleRegistry);
    }
    city() {
        return __classPrivateFieldGet(this, _Part_city, "f");
    }
    yield(yields) {
        const rules = __classPrivateFieldGet(this, _Part_ruleRegistry, "f").get(Yield_1.default);
        yields.forEach((partYield) => rules
            .filter((rule) => rule.validate(this, partYield))
            .forEach((rule) => rule.process(this, partYield)));
        return yields;
    }
}
exports.Part = Part;
_Part_city = new WeakMap(), _Part_ruleRegistry = new WeakMap();
exports.default = Part;
//# sourceMappingURL=Part.js.map