# Tip calculator smart contract

##### A contract that calculates a tip based on user's rating of the meal

### Usage

The contract exposes a few methods that facilitate tip calculation

### `reserve-meal-cost (cost int)`

Stores the meal cost and then calculates the tip initially as the minimum 15%

### `get-meal-cost`

Gets the stored meal cost

### `get-tip-value`

Gets the latest tip value

### `get-rating`

Returns the current stored rating (initially 0)

### `finish-meal (userRating int)`

Stores the rating of the meal and calculates the tip based on that rating
