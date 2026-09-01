import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import ChooseSlot from './Rules/ChooseSlot';
import Part from './Part';
import Slot from './Slot';
import Active from './Rules/Active';

const isBetween = (n: number, x: number, y: number): boolean => x <= n && n < y;

export interface ILayout extends IDataObject {
  activeSlots(): Slot[];
  get(x: number, y: number): Slot | null;
  getAdjacent(slot: Slot): Slot[];
  getFreeSlot(part: Part): Slot | null;
  height(): number;
  inactiveSlots(): Slot[];
  slots(): Slot[];
  width(): number;
}

export class Layout extends DataObject implements ILayout {
  private _cachedSearch = new Map<string, Slot>();
  private _height: number;
  private _ruleRegistry: RuleRegistry;
  private _slots: Slot[] = [];
  private _width: number;

  constructor(
    height: number,
    width: number,
    slots: Slot[],
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this.addKey('activeSlots', 'height', 'inactiveSlots', 'slots', 'width');

    this._height = height;
    this._ruleRegistry = ruleRegistry;
    this._width = width;

    this._slots.push(...slots);
  }

  activeSlots(): Slot[] {
    return this._slots.filter((slot) =>
      this._ruleRegistry.process(Active, slot, this).every((result) => result)
    );
  }

  get(x: number, y: number): Slot | null {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
      return null;
    }

    const key = [x, y].toString();

    if (!this._cachedSearch.has(key)) {
      const [slot] = this._slots.filter(
        (slot) =>
          isBetween(x, slot.x(), slot.x() + slot.width()) &&
          isBetween(y, slot.y(), slot.y() + slot.height())
      );

      this._cachedSearch.set(key, slot ?? null);
    }

    return this._cachedSearch.get(key)!;
  }

  getAdjacent(slot: Slot): Slot[] {
    const adjacentSlots = new Set<Slot>();

    for (let x = slot.x(), maxX = slot.x() + slot.width() - 1; x <= maxX; x++) {
      const above = this.get(x, slot.y() - 1),
        below = this.get(x, slot.y() + slot.height());

      if (above) {
        adjacentSlots.add(above);
      }

      if (below) {
        adjacentSlots.add(below);
      }
    }

    for (
      let y = slot.y(), maxY = slot.y() + slot.height() - 1;
      y <= maxY;
      y++
    ) {
      const before = this.get(slot.x() - 1, y),
        after = this.get(slot.x() + slot.width(), y);

      if (before) {
        adjacentSlots.add(before);
      }

      if (after) {
        adjacentSlots.add(after);
      }
    }

    return [...adjacentSlots.values()].filter(
      (adjacentSlot) => adjacentSlot !== slot
    );
  }

  getFreeSlot(part: Part): Slot | null {
    const [slot] = this._ruleRegistry.process(ChooseSlot, part, this);

    return slot ?? null;
  }

  height(): number {
    return this._height;
  }

  inactiveSlots(): Slot[] {
    return this._slots.filter((slot) =>
      this._ruleRegistry.process(Active, slot, this).some((result) => !result)
    );
  }

  slots(): Slot[] {
    return this._slots;
  }

  width(): number {
    return this._width;
  }
}

export default Layout;
