import type Component from '@glimmer/component';

export default function tagNameIsComponent(as: string | typeof Component) {
  return typeof as === 'object';
}