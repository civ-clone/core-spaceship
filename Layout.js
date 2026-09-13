"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const ChooseSlot_1 = require("./Rules/ChooseSlot");
const Active_1 = require("./Rules/Active");
const isBetween = (n, x, y) => x <= n && n < y;
class Layout extends DataObject_1.DataObject {
    constructor(height, width, slots, ruleRegistry = RuleRegistry_1.instance) {
        super();
        this._cachedSearch = new Map();
        this._slots = [];
        this.addKey('activeSlots', 'height', 'inactiveSlots', 'slots', 'width');
        this._height = height;
        this._ruleRegistry = ruleRegistry;
        this._width = width;
        this._slots.push(...slots);
    }
    activeSlots() {
        return this._slots.filter((slot) => this._ruleRegistry.process(Active_1.default, slot, this).every((result) => result));
    }
    get(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return null;
        }
        const key = [x, y].toString();
        if (!this._cachedSearch.has(key)) {
            const [slot] = this._slots.filter((slot) => isBetween(x, slot.x(), slot.x() + slot.width()) &&
                isBetween(y, slot.y(), slot.y() + slot.height()));
            this._cachedSearch.set(key, slot !== null && slot !== void 0 ? slot : null);
        }
        return this._cachedSearch.get(key);
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
        return [...adjacentSlots.values()].filter((adjacentSlot) => adjacentSlot !== slot);
    }
    getFreeSlot(part) {
        const [slot] = this._ruleRegistry.process(ChooseSlot_1.default, part, this);
        return slot !== null && slot !== void 0 ? slot : null;
    }
    height() {
        return this._height;
    }
    inactiveSlots() {
        return this._slots.filter((slot) => this._ruleRegistry.process(Active_1.default, slot, this).some((result) => !result));
    }
    slots() {
        return this._slots;
    }
    width() {
        return this._width;
    }
}
exports.Layout = Layout;
Layout.transient = ['_cachedSearch', '_ruleRegistry'];
exports.default = Layout;
//# sourceMappingURL=Layout.js.map