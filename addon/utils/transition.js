import { TrackedSet } from 'tracked-maps-and-sets';
import { timeout } from 'ember-concurrency';

/**
 * Create a promise that resolves after the transition timeout for a node
 *
 * Extracted from HeadlessUI here:
 *
 * https://github.com/tailwindlabs/headlessui/blob/b961a189d57fa24af2a0bd0a6d73fa44e1d34529/packages/%40headlessui-react/src/components/transitions/utils/transition.ts#L17
 *
 * @param {HTMLElement} node
 * @return {Promise<void>}
 */
export async function waitForTransition(node) {
  // Safari returns a comma separated list of values, so let's sort them and take the highest value.
  let { transitionDuration, transitionDelay } = getComputedStyle(node);
  let [durationMs, delaysMs] = [transitionDuration, transitionDelay].map(
    (value) => {
      let [resolvedValue = 0] = value
        .split(',')
        // Remove falsy we can't work with
        .filter(Boolean)
        // Values are returned as `0.3s` or `75ms`
        .map((v) => (v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000))
        .sort((a, z) => z - a);

      return resolvedValue;
    }
  );

  if (durationMs !== 0) {
    await timeout(durationMs + delaysMs);
  }
}

export function splitClassNames(classString = '') {
  return classString
    .split(' ')
    .map((part) => part.trim())
    .filter((part) => part.trim().length > 1);
}

export class ClassNameSet {
  data = new TrackedSet();

  add(...values) {
    for (let value of values) {
      this.data.add(value);
    }
  }

  delete(...values) {
    for (let value of values) {
      this.data.delete(value);
    }
  }

  toString() {
    return Array.from(this.data).join(' ');
  }
}
