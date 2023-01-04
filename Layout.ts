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
  #cachedSearch = new Map<string, Slot>();
  #height: number;
  #ruleRegistry: RuleRegistry;
  #slots: Slot[] = [];
  #width: number;

  constructor(
    height: number,
    width: number,
    slots: Slot[],
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this.addKey('activeSlots', 'height', 'inactiveSlots', 'slots', 'width');

    this.#height = height;
    this.#ruleRegistry = ruleRegistry;
    this.#width = width;

    this.#slots.push(...slots);
  }

  activeSlots(): Slot[] {
    return this.#slots.filter((slot) =>
      this.#ruleRegistry.process(Active, slot, this).every((result) => result)
    );
  }

  get(x: number, y: number): Slot | null {
    if (x < 0 || x >= this.#width || y < 0 || y >= this.#height) {
      return null;
    }

    const key = [x, y].toString();

    if (!this.#cachedSearch.has(key)) {
      const [slot] = this.#slots.filter(
        (slot) =>
          isBetween(x, slot.x(), slot.x() + slot.width()) &&
          isBetween(y, slot.y(), slot.y() + slot.height())
      );

      this.#cachedSearch.set(key, slot ?? null);
    }

    return this.#cachedSearch.get(key)!;
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
    const [slot] = this.#ruleRegistry.process(ChooseSlot, part, this);

    return slot ?? null;
  }

  height(): number {
    return this.#height;
  }

  inactiveSlots(): Slot[] {
    return this.#slots.filter((slot) =>
      this.#ruleRegistry.process(Active, slot, this).some((result) => !result)
    );
  }

  slots(): Slot[] {
    return this.#slots;
  }

  width(): number {
    return this.#width;
  }
}

export default Layout;
