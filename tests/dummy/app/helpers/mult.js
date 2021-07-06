import { helper } from '@ember/component/helper';

export default helper(function mult([first, second] /*, hash*/) {
  return first * second;
});
