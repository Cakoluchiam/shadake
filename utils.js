// For stuff that does stuff with things.

/**
 * Chooses an item from a list, with weighted randomness.
 * Weights do not need to sum to 1.
 *
 * Accepts one of:
 *  Array of items and an Array of weights.
 *  Object of the form {item1: weight1, item2: weight2, ...}
 *  Two-column array of the form [[item1, item2, ...], [weight1, weight2, ...]]
**/
function weightedChoice(stuff, weights) {
  let items;
  if(weights === undefined) {
    if(Array.isArray(stuff)) {
      items = stuff[0];
      weights = stuff[1];
    } else {
      items = Object.keys(stuff);
      weights = Object.values(stuff);
    }
  } else {
    items = stuff;
  }
  
  let roll = Math.random() * weights.reduce((sum, value) => {return sum+value;}, 0);
  let choice;
  
  weights.reduce((mass, weight, index) => {
    if(choice !== undefined) return 0;
    if(mass <= weight) {
      choice = items[index];
      return 0;
    } else return (mass - weight);
  }, roll);
  
  return choice;
}
