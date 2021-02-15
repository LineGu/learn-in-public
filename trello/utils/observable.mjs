export const Observation = {
  observers: new Set(),
  subscribe(observer) {
    Observation.observers.add(observer);
  },
  unSubscribe(observer) {
    Observation.observers.delete(observer);
  },
  notify(data) {
    Observation.observers.forEach((observer) => {
      observer(data);
    });
  },
};
