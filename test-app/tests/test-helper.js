import './assertions/dom';
import './assertions/testdouble';
import './assertions/wait-for';

import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

import Application from 'test-app/app';
import config from 'test-app/config/environment';

setApplication(Application.create(config.APP));

start();
