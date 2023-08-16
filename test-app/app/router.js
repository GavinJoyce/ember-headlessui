import EmberRouter from '@ember/routing/router';

import config from 'test-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('menu', function () {
    this.route('menu-basic');
    this.route('menu-with-popper');
    this.route('menu-with-transition');
    this.route('menu-with-transition-and-popper');
  });

  this.route('listbox', function () {
    this.route('listbox-basic');
    this.route('listbox-with-transition');
  });

  this.route('combobox', function () {
    this.route('combobox-basic');
    this.route('combobox-multiple');
  });

  this.route('switch', function () {
    this.route('switch-basic');
    this.route('switch-checkbox');
  });

  this.route('dialog', function () {
    this.route('dialog-modal');
    this.route('dialog-modal-with-transition');
    this.route('dialog-slide-over');
    this.route('dialog-nested');
  });

  this.route('radio-group', function () {
    this.route('radio-group-basic');
  });

  this.route('tabs', function () {
    this.route('tabs-basic');
    this.route('tabs-with-onchange-action');
    this.route('tabs-with-disable-state');
  });
});
