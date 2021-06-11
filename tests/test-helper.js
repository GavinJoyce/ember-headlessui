import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { installWaitFor } from 'qunit-wait-for';

setApplication(Application.create(config.APP));

installWaitFor(QUnit);
setup(QUnit.assert);

start();
