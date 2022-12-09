# core-spaceship

The core models relating to building and launching a `Spaceship`, including `Part`s (of which the `Spaceship` is
constructed) and the associated `Rule`s.

## Rules

- `ChanceOfSuccess` - returns a value between `0` and `1`.
- `FlightTime` - returns the estimated number of `Turn`s the flight will take.
- `Landed` - triggered when the `Spaceship` successfully lands at its destination.
- `Launch` - triggered when the `Spaceship` is launched.
- `Lost` - triggered when the `Spaceship` doesn't reach its final destination.
- `Built` - triggered when a `Part` is built.
- `Yield` - used to calculate the associated `Yield`s from each `Part` (`Mass`, `Fuel`, `Population`, etc).
