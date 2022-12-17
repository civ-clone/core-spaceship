import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import Part from './Part';

export interface ISlot extends IDataObject {
  accepts(part: Part): boolean;
  empty(): boolean;
  fill(part: Part): void;
  height(): number;
  part(): Part | null;
  width(): number;
  x(): number;
  y(): number;
}

export class Slot extends DataObject implements ISlot {
  #accepts: typeof Part[] = [];
  #height: number;
  #part: Part | null = null;
  #width: number;
  #x: number;
  #y: number;

  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    accepts: typeof Part[]
  ) {
    super();

    this.addKey('height', 'part', 'width', 'x', 'y');

    this.#height = height;
    this.#width = width;
    this.#x = x;
    this.#y = y;
    this.#accepts.push(...accepts);
  }

  accepts(part: Part): boolean {
    return this.#accepts.some(
      (PartType: typeof Part) => part instanceof PartType
    );
  }

  empty(): boolean {
    return this.#part === null;
  }

  fill(part: Part): void {
    if (!this.accepts(part)) {
      return;
    }

    this.#part = part;
  }

  height(): number {
    return this.#height;
  }

  part(): Part | null {
    return this.#part;
  }

  width(): number {
    return this.#width;
  }

  x(): number {
    return this.#x;
  }

  y(): number {
    return this.#y;
  }
}

export default Slot;
