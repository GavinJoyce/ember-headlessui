import Application from 'dummy/app';
import config from 'dummy/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

import './assertions/dom';
import './assertions/testdouble';
import './assertions/wait-for';

setApplication(Application.create(config.APP));

start();
