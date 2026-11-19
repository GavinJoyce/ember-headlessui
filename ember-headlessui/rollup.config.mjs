import { babel } from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';

const addon = new Addon({ srcDir: 'src', destDir: 'dist' });
const extensions = ['.js', '.ts'];

export default {
  output: addon.output(),
  plugins: [
    addon.publicEntrypoints([
      'components/**/*.js',
      'helpers/**/*.js',
      'modifiers/**/*.js',
      'services/**/*.js',
      'utils/**/*.js',
    ]),
    addon.appReexports([
      'components/**/*.js',
      'helpers/tag-name-is-component.js',
      'modifiers/**/*.js',
      'services/**/*.js',
    ]),
    addon.dependencies(),
    babel({ extensions, babelHelpers: 'bundled' }),
    addon.hbs(),
    addon.clean(),
  ],
};
