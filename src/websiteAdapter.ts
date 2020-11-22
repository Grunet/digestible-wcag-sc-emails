enum Action {
  Unsubscribe,
}

function getLinkForAction(action: Action) {
  const href = actionToHrefMap.get(action);

  return href;
}

//These should be centralized in their own repo if they're used elsewhere in the future
const actionToHrefMap = new Map();
actionToHrefMap.set(Action.Unsubscribe, "https://dwcag.org/unsubscribe");

export { getLinkForAction, Action }
