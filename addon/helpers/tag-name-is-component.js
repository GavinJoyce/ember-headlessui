import { helper } from '@ember/component/helper';

function tagNameIsComponent([as]) {
  return typeof as === 'object';
}

export default helper(tagNameIsComponent);
