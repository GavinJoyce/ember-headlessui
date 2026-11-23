import './assertions/dom';
import './assertions/testdouble';
import './assertions/wait-for';

import { setApplication } from '@ember/test-helpers';
import { setupEmberOnerrorValidation, start } from 'ember-qunit';
import { loadTests } from 'ember-qunit/test-loader';

import Application from 'test-app/app';
import config from 'test-app/config/environment';

setApplication(Application.create(config.APP));

setupEmberOnerrorValidation();
loadTests();
start();
