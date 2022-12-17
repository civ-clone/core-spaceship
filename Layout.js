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
var _Layout_height, _Layout_ruleRegistry, _Layout_slots, _Layout_width;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const ChooseSlot_1 = require("./Rules/ChooseSlot");
const cachedSearch = new Map();
const isBetween = (n, x, y) => x <= n && n < y;
class Layout extends DataObject_1.DataObject {
    constructor(height, width, slots, ruleRegistry = RuleRegistry_1.instance) {
        super();
        _Layout_height.set(this, void 0);
        _Layout_ruleRegistry.set(this, void 0);
        _Layout_slots.set(this, []);
        _Layout_width.set(this, void 0);
        this.addKey('height', 'slots', 'width');
        __classPrivateFieldSet(this, _Layout_height, height, "f");
        __classPrivateFieldSet(this, _Layout_ruleRegistry, ruleRegistry, "f");
        __classPrivateFieldSet(this, _Layout_width, width, "f");
        __classPrivateFieldGet(this, _Layout_slots, "f").push(...slots);
    }
    get(x, y) {
        if (x < 0 || x >= __classPrivateFieldGet(this, _Layout_width, "f") || y < 0 || y >= __classPrivateFieldGet(this, _Layout_height, "f")) {
            return null;
        }
        const key = [x, y].toString();
        if (!cachedSearch.has(key)) {
            const [slot] = __classPrivateFieldGet(this, _Layout_slots, "f").filter((slot) => isBetween(x, slot.x(), slot.x() + slot.width()) &&
                isBetween(y, slot.y(), slot.y() + slot.height()));
            cachedSearch.set(key, slot !== null && slot !== void 0 ? slot : null);
        }
        return cachedSearch.get(key);
    }
    getAdjacent(slot) {
        const adjacentSlots = new Set();
        for (let x = slot.x(), maxX = slot.x() + slot.width() - 1; x <= maxX; x++) {
            const above = this.get(x, slot.y() - 1), below = this.get(x, slot.y() + slot.height());
            if (above) {
                adjacentSlots.add(above);
            }
            if (below) {
                adjacentSlots.add(below);
            }
        }
        for (let y = slot.y(), maxY = slot.y() + slot.height() - 1; y <= maxY; y++) {
            const before = this.get(slot.x() - 1, y), after = this.get(slot.x() + slot.width(), y);
            if (before) {
                adjacentSlots.add(before);
            }
            if (after) {
                adjacentSlots.add(after);
            }
        }
        return [...adjacentSlots.values()];
    }
    getFreeSlot(part) {
        const [slot] = __classPrivateFieldGet(this, _Layout_ruleRegistry, "f").process(ChooseSlot_1.default, part, this);
        return slot !== null && slot !== void 0 ? slot : null;
    }
    height() {
        return __classPrivateFieldGet(this, _Layout_height, "f");
    }
    slots() {
        return __classPrivateFieldGet(this, _Layout_slots, "f");
    }
    width() {
        return __classPrivateFieldGet(this, _Layout_width, "f");
    }
}
exports.Layout = Layout;
_Layout_height = new WeakMap(), _Layout_ruleRegistry = new WeakMap(), _Layout_slots = new WeakMap(), _Layout_width = new WeakMap();
exports.default = Layout;
//# sourceMappingURL=Layout.js.map