import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

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
  });

  this.route('switch', function () {
    this.route('switch-basic');
    this.route('switch-checkbox');
  });

  this.route('dialog', function () {
    this.route('dialog-modal');
    this.route('dialog-slide-over');
    this.route('dialog-nested');
  });
});
