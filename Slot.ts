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
  private _accepts: (typeof Part)[] = [];
  private _height: number;
  private _part: Part | null = null;
  private _width: number;
  private _x: number;
  private _y: number;

  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    accepts: (typeof Part)[]
  ) {
    super();

    this.addKey('height', 'part', 'width', 'x', 'y');

    this._height = height;
    this._width = width;
    this._x = x;
    this._y = y;
    this._accepts.push(...accepts);
  }

  accepts(part: Part): boolean {
    return this._accepts.some(
      (PartType: typeof Part) => part instanceof PartType
    );
  }

  empty(): boolean {
    return this._part === null;
  }

  fill(part: Part): void {
    if (!this.accepts(part)) {
      return;
    }

    this._part = part;
  }

  height(): number {
    return this._height;
  }

  part(): Part | null {
    return this._part;
  }

  width(): number {
    return this._width;
  }

  x(): number {
    return this._x;
  }

  y(): number {
    return this._y;
  }
}

export default Slot;
