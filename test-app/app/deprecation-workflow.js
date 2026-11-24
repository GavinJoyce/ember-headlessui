import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

setupDeprecationWorkflow({
  workflow: [
    { handler: 'silence', matchId: 'manager-capabilities.modifiers-3-13' },
  ],
});
