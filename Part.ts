import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import { IDataObject } from '@civ-clone/core-data-object/DataObject';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from './Rules/Yield';

export interface IPart extends IDataObject {
  city(): City;
  yield(yields: Yield[]): Yield[];
}

export class Part extends Buildable implements IPart {
  #city: City;
  #ruleRegistry: RuleRegistry;

  constructor(city: City, ruleRegistry: RuleRegistry = ruleRegistryInstance) {
    super();

    this.#city = city;
    this.#ruleRegistry = ruleRegistry;

    this.addKey('city');
  }

  public static build(
    city: City,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ): Part {
    return new this(city, ruleRegistry);
  }

  city(): City {
    return this.#city;
  }

  yield(yields: Yield[]): Yield[] {
    const rules = this.#ruleRegistry.get(YieldRule);

    yields.forEach((partYield: Yield): void =>
      rules
        .filter((rule: YieldRule): boolean => rule.validate(this, partYield))
        .forEach((rule: YieldRule): any => rule.process(this, partYield))
    );

    return yields;
  }
}

export default Part;
