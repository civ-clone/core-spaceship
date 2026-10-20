# core-spaceship

The core models relating to building and launching a `Spaceship`, including `Part`s (of which the `Spaceship` is
constructed) and the associated `Rule`s.

A `Spaceship` is built using `Layout` which consists of `Slot`s and is chosen from the `LayoutRegistry`.

## Rules

- `Active` - confirms whether a `Slot` is active.
- `Built` - triggered when a `Part` is built.
- `ChanceOfSuccess` - returns a value between `0` and `1`, for a ruleset to score a landed `Spaceship` by. A `Spaceship`
  that arrives always lands.
- `ChooseSlot` - picks the preferred `Slot` for the `Part`.
- `FlightTime` - returns the number of `Year`s the flight will take.
- `Landed` - triggered when the `Spaceship` successfully lands at its destination.
- `Launch` - triggered when the `Spaceship` is launched.
- `Lost` - triggered when the `Spaceship` is lost (`lose()`): cancelled while it's being built, or never arriving once
  launched.
- `Yield` - used to calculate the associated `Yield`s from each `Part` (`Mass`, `Fuel`, `Population`, etc).
