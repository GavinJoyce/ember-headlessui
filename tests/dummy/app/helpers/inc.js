import { helper } from '@ember/component/helper';

export default helper(function inc([value] /*, hash*/) {
  return value + 1;
});
