import Counter from '../counter';

describe('Counter', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter();
  });

  describe('constructor()', () => {
    it('should create a new count property', () => {
      expect(counter.getCount()).toBe(0);
    });
  });

  describe('increment', () => {
    it('should increment the counter by 1 if nothing provided', () => {
      counter.increment();
      expect(counter.getCount()).toBe(1);
    });

    it('should increment the counter by the provided number', () => {
      counter.increment(5);
      expect(counter.getCount()).toBe(5);
    });
  });
});
