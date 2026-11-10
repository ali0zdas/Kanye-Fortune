// e2e/harness/assertions.ts
// Lightweight, zero-dependency rich assertion library

export class AssertionError extends Error {
  actual: unknown;
  expected: unknown;

  constructor(message: string, actual?: unknown, expected?: unknown) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false;
  }

  return true;
}

function formatValue(v: unknown): string {
  if (typeof v === 'string') return `"${v}"`;
  if (typeof v === 'undefined') return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return `[Function: ${v.name || 'anonymous'}]`;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export interface Matchers<T> {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toBeGreaterThan(expected: number): void;
  toBeGreaterThanOrEqual(expected: number): void;
  toBeLessThan(expected: number): void;
  toBeLessThanOrEqual(expected: number): void;
  toBeCloseTo(expected: number, precision?: number): void;
  toContain(item: unknown): void;
  toMatch(pattern: RegExp | string): void;
  toThrow(expectedError?: RegExp | string): void;
  not: Matchers<T>;
}

export function expect<T>(actual: T): Matchers<T> {
  return createMatcher(actual, false);
}

function createMatcher<T>(actual: T, isNot: boolean): Matchers<T> {
  const matchers: Matchers<T> = {
    get not() {
      return createMatcher(actual, !isNot);
    },

    toBe(expected: unknown) {
      const pass = Object.is(actual, expected);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to be' : 'to be'} ${formatValue(expected)}`,
          actual,
          expected
        );
      }
    },

    toEqual(expected: unknown) {
      const pass = deepEqual(actual, expected);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to equal' : 'to equal'} ${formatValue(expected)}`,
          actual,
          expected
        );
      }
    },

    toBeTruthy() {
      const pass = Boolean(actual);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to be truthy' : 'to be truthy'}`,
          actual,
          true
        );
      }
    },

    toBeFalsy() {
      const pass = !actual;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to be falsy' : 'to be falsy'}`,
          actual,
          false
        );
      }
    },

    toBeNull() {
      const pass = actual === null;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to be null' : 'to be null'}`,
          actual,
          null
        );
      }
    },

    toBeUndefined() {
      const pass = actual === undefined;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to be undefined' : 'to be undefined'}`,
          actual,
          undefined
        );
      }
    },

    toBeDefined() {
      const pass = actual !== undefined;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to be defined' : 'to be defined'}`,
          actual,
          'defined'
        );
      }
    },

    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number') {
        throw new AssertionError(`Actual value ${formatValue(actual)} is not a number`);
      }
      const pass = actual > expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'not to be >' : 'to be >'} ${expected}`,
          actual,
          expected
        );
      }
    },

    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== 'number') {
        throw new AssertionError(`Actual value ${formatValue(actual)} is not a number`);
      }
      const pass = actual >= expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'not to be >=' : 'to be >='} ${expected}`,
          actual,
          expected
        );
      }
    },

    toBeLessThan(expected: number) {
      if (typeof actual !== 'number') {
        throw new AssertionError(`Actual value ${formatValue(actual)} is not a number`);
      }
      const pass = actual < expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'not to be <' : 'to be <'} ${expected}`,
          actual,
          expected
        );
      }
    },

    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== 'number') {
        throw new AssertionError(`Actual value ${formatValue(actual)} is not a number`);
      }
      const pass = actual <= expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'not to be <=' : 'to be <='} ${expected}`,
          actual,
          expected
        );
      }
    },

    toBeCloseTo(expected: number, precision = 2) {
      if (typeof actual !== 'number') {
        throw new AssertionError(`Actual value ${formatValue(actual)} is not a number`);
      }
      const expectedDiff = Math.pow(10, -precision) / 2;
      const receivedDiff = Math.abs(expected - actual);
      const pass = receivedDiff < expectedDiff;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'not to be close to' : 'to be close to'} ${expected} (precision ${precision})`,
          actual,
          expected
        );
      }
    },

    toContain(item: unknown) {
      let pass = false;
      if (typeof actual === 'string' && typeof item === 'string') {
        pass = actual.includes(item);
      } else if (Array.isArray(actual)) {
        pass = actual.some(x => deepEqual(x, item));
      } else if (actual instanceof Set) {
        pass = actual.has(item);
      } else {
        throw new AssertionError(`toContain cannot be used on type ${typeof actual}`);
      }
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'not to contain' : 'to contain'} ${formatValue(item)}`,
          actual,
          item
        );
      }
    },

    toMatch(pattern: RegExp | string) {
      if (typeof actual !== 'string') {
        throw new AssertionError(`Actual value ${formatValue(actual)} is not a string`);
      }
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      const pass = regex.test(actual);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected "${actual}" ${isNot ? 'not to match' : 'to match'} ${pattern}`,
          actual,
          pattern
        );
      }
    },

    toThrow(expectedError?: RegExp | string) {
      if (typeof actual !== 'function') {
        throw new AssertionError(`Expected a function, but got ${typeof actual}`);
      }
      let thrown: unknown = null;
      let didThrow = false;
      try {
        (actual as () => unknown)();
      } catch (err) {
        didThrow = true;
        thrown = err;
      }

      if (!didThrow && !isNot) {
        throw new AssertionError('Expected function to throw, but it did not');
      }
      if (didThrow && isNot) {
        throw new AssertionError(`Expected function not to throw, but it threw: ${String(thrown)}`);
      }

      if (didThrow && expectedError && !isNot) {
        const msg = thrown instanceof Error ? thrown.message : String(thrown);
        const regex = typeof expectedError === 'string' ? new RegExp(expectedError) : expectedError;
        if (!regex.test(msg)) {
          throw new AssertionError(
            `Expected function to throw error matching ${expectedError}, but got: "${msg}"`
          );
        }
      }
    }
  };

  return matchers;
}
