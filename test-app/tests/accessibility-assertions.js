import Qunit from 'qunit';

import { isFocusableElement } from './utils/focus-management';

function getDialog() {
  return document.querySelector('[role="dialog"]');
}

function getDialogs() {
  return Array.from(document.querySelectorAll('[role="dialog"]'));
}

function getDialogOverlay() {
  return document.querySelector('[id$="-headlessui-dialog-overlay"]');
}

function getDialogTitle() {
  return document.querySelector('[id$="-headlessui-dialog-title"]');
}

function getDialogDescription() {
  return document.querySelector('[id$="-headlessui-dialog-description"]');
}

function getDialogOverlays() {
  return Array.from(
    document.querySelectorAll('[id$="-headlessui-dialog-overlay"]')
  );
}

function getListboxButton() {
  return document.querySelector('[role="button"]');
}

function getListboxButtons() {
  return Array.from(document.querySelectorAll('[role="button"]'));
}

function getListboxLabel() {
  return document.querySelector('[id$="-headlessui-listbox-label"]');
}

function getListboxOptions() {
  return Array.from(document.querySelectorAll('[role="option"]'));
}

function getListbox() {
  return document.querySelector('[role="listbox"]');
}

function getListboxes() {
  return Array.from(document.querySelectorAll('[role="listbox"]'));
}

function getCombobox() {
  return document.querySelector('[role="listbox"]');
}

function getComboboxes() {
  return Array.from(document.querySelectorAll('[role="listbox"]'));
}

function getComboboxButton() {
  return document.querySelector('[role="button"]');
}

function getComboboxButtons() {
  return Array.from(document.querySelectorAll('[role="button"]'));
}

function getComboboxOptions() {
  return Array.from(document.querySelectorAll('[role="option"]'));
}

function getComboboxInput() {
  return document.querySelector('[role="combobox"]');
}

function getComboboxInputs() {
  return Array.from(document.querySelectorAll('[role="combobox"]'));
}

function getComboboxLabel() {
  return document.querySelector('[id$="-headlessui-combobox-label"]');
}

const DialogState = {
  /** The dialog is visible to the user. */
  Visible: 'Visible',

  /** The dialog is **not** visible to the user. It's still in the DOM, but it is hidden. */
  InvisibleHidden: 'InvisibleHidden',

  /** The dialog is **not** visible to the user. It's not in the DOM, it is unmounted. */
  InvisibleUnmounted: 'InvisibleUnmounted',
};

const ListboxState = {
  Visible: 'Visible',
  InvisibleHidden: 'InvisibleHidden',
  InvisibleUnmounted: 'InvisibleUnmounted',
};

const ListboxMode = {
  /** The listbox is in the `single` mode. */
  Single: 'Single',
  /** The listbox is in the `multiple` mode. */
  Multiple: 'Multiple',
};

const ComboboxState = {
  Visible: 'Visible',
  InvisibleHidden: 'InvisibleHidden',
  InvisibleUnmounted: 'InvisibleUnmounted',
};

const ComboboxMode = {
  /** The combobox is in the `single` mode. */
  Single: 'Single',
  /** The combobox is in the `multiple` mode. */
  Multiple: 'Multiple',
};

function assertNever(x) {
  throw new Error('Unexpected object: ' + x);
}

function assertActiveElement(element, comment) {
  try {
    if (element === null) {
      Qunit.assert.notEqual(element, null);
      return;
    }
    return Qunit.assert.waitFor(() => {
      Qunit.assert.strictEqual(document.activeElement, element, comment);
    });
  } catch (err) {
    Error.captureStackTrace(err, assertActiveElement);
    throw err;
  }
}

function assertHidden(element) {
  try {
    if (element === null) {
      Qunit.assert.notEqual(element, null);
      return;
    }

    Qunit.assert.dom(element).hasAttribute('hidden');
    Qunit.assert.dom(element).hasStyle({ display: 'none' });
  } catch (err) {
    Error.captureStackTrace(err, assertHidden);
    throw err;
  }
}

function assertVisible(element) {
  try {
    if (element === null) {
      Qunit.assert.notEqual(element, null);
      return;
    }

    Qunit.assert.dom(element).doesNotHaveAttribute('hidden');
    Qunit.assert.dom(element).doesNotHaveStyle({ display: 'none' });
  } catch (err) {
    Error.captureStackTrace(err, assertVisible);
    throw err;
  }
}

function assertDialog(options, dialog = getDialog()) {
  options.attributes = options.attributes ?? {};

  if (!options.state) {
    Qunit.assert.notEqual(
      options.state,
      undefined,
      'You must provide an expected `state`'
    );

    return;
  }

  try {
    switch (options.state) {
      case DialogState.InvisibleHidden: {
        if (dialog === null) {
          Qunit.assert.notEqual(dialog, null);

          return;
        }

        assertHidden(dialog);

        Qunit.assert.dom(dialog).hasAttribute('role', 'dialog');
        Qunit.assert.dom(dialog).doesNotHaveAttribute('aria-modal');

        if (options.textContent) {
          Qunit.assert.dom(dialog).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert.dom(dialog).hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.Visible: {
        if (dialog === null) {
          Qunit.assert.notEqual(dialog, null);

          return;
        }

        assertVisible(dialog);

        Qunit.assert.dom(dialog).hasAttribute('role', 'dialog');
        Qunit.assert.dom(dialog).hasAttribute('aria-modal', 'true');

        if (options.textContent) {
          Qunit.assert.dom(dialog).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert.dom(dialog).hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.InvisibleUnmounted: {
        Qunit.assert.strictEqual(dialog, null);
        break;
      }

      default: {
        assertNever(options.state);
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertDialog);
    throw err;
  }
}

function assertFocusable(element) {
  try {
    if (element === null) {
      Qunit.assert.notEqual(element, null);
      return;
    }

    Qunit.assert.equal(isFocusableElement(element, 'Strict'), true);
  } catch (err) {
    if (err instanceof Error) Error.captureStackTrace(err, assertFocusable);
    throw err;
  }
}

function assertNotFocusable(element) {
  try {
    if (element === null) {
      Qunit.assert.notEqual(element, null);
      return;
    }

    Qunit.assert.equal(isFocusableElement(element, 'Strict'), false);
  } catch (err) {
    if (err instanceof Error) Error.captureStackTrace(err, assertNotFocusable);
    throw err;
  }
}

function getRadioGroupLabel() {
  return document.querySelector('[id^="headlessui-label-"]');
}

function getRadioGroup() {
  return document.querySelector('[role="radiogroup"]');
}

function getRadioGroupOptions() {
  return document.querySelectorAll('[id^="headlessui-radiogroup-option-"]');
}

function assertRadioGroupLabel(
  options,
  label = getRadioGroupLabel(),
  radioGroup = getRadioGroup()
) {
  try {
    if (label === null) {
      Qunit.assert.notEqual(label, null);
      return;
    }
    if (radioGroup === null) {
      Qunit.assert.notEqual(radioGroup, null);
      return;
    }

    Qunit.assert.dom(label).hasAttribute('id');
    Qunit.assert.dom(radioGroup).hasAttribute('aria-labelledby', label.id);

    if (options.textContent) {
      Qunit.assert.dom(label).hasText(options.textContent);
      return;
    }

    for (let attributeName in options.attributes) {
      Qunit.assert
        .dom(label)
        .hasAttribute(attributeName, options.attributes[attributeName]);
    }
  } catch (err) {
    if (err instanceof Error)
      Error.captureStackTrace(err, assertRadioGroupLabel);
    throw err;
  }
}

function assertDialogOverlay(options, overlay = getDialogOverlay()) {
  options.attributes = options.attributes ?? {};

  if (!options.state) {
    Qunit.assert.notEqual(
      options.state,
      undefined,
      'You must provide an expected `state`'
    );

    return;
  }

  try {
    switch (options.state) {
      case DialogState.InvisibleHidden: {
        if (overlay === null) {
          Qunit.assert.notEqual(overlay, null);

          return;
        }

        assertHidden(overlay);

        if (options.textContent) {
          Qunit.assert.dom(overlay).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert.dom(overlay).hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.Visible: {
        if (overlay === null) {
          Qunit.assert.notEqual(overlay, null);

          return;
        }

        assertVisible(overlay);

        if (options.textContent) {
          Qunit.assert.dom(overlay).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert.dom(overlay).hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.InvisibleUnmounted: {
        Qunit.assert.strictEqual(overlay, null);

        break;
      }

      default: {
        assertNever(options.state);
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertDialogOverlay);
    throw err;
  }
}

function assertDialogTitle(
  options,
  title = getDialogTitle(),
  dialog = getDialog()
) {
  options.attributes = options.attributes ?? {};

  if (!options.state) {
    Qunit.assert.notEqual(
      options.state,
      undefined,
      'You must provide an expected `state`'
    );

    return;
  }

  try {
    switch (options.state) {
      case DialogState.InvisibleHidden: {
        if (title === null) {
          Qunit.assert.notEqual(title, null);

          return;
        }

        if (dialog === null) {
          Qunit.assert.notEqual(dialog, null);

          return;
        }

        assertHidden(title);

        Qunit.assert.dom(title).hasAttribute('id');
        Qunit.assert.dom(dialog).hasAttribute('aria-labelledby', title.id);

        if (options.textContent) {
          Qunit.assert.dom(title).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert.dom(title).hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.Visible: {
        if (title === null) {
          Qunit.assert.notEqual(title, null);

          return;
        }

        if (dialog === null) {
          Qunit.assert.notEqual(dialog, null);

          return;
        }

        assertVisible(title);

        Qunit.assert.dom(title).hasAttribute('id');
        Qunit.assert.dom(dialog).hasAttribute('aria-labelledby', title.id);

        if (options.textContent) {
          Qunit.assert.dom(title).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert.dom(title).hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.InvisibleUnmounted: {
        Qunit.assert.strictEqual(title, null);

        break;
      }

      default: {
        assertNever(options.state);
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertDialogTitle);
    throw err;
  }
}

function assertDialogDescription(
  options,
  description = getDialogDescription(),
  dialog = getDialog()
) {
  options.attributes = options.attributes ?? {};

  if (!options.state) {
    Qunit.assert.notEqual(
      options.state,
      undefined,
      'You must provide an expected `state`'
    );

    return;
  }

  try {
    switch (options.state) {
      case DialogState.InvisibleHidden: {
        if (description === null) {
          Qunit.assert.notEqual(description, null);

          return;
        }

        if (dialog === null) {
          Qunit.assert.notEqual(dialog, null);

          return;
        }

        assertHidden(description);

        Qunit.assert.dom(description).hasAttribute('id');
        Qunit.assert
          .dom(dialog)
          .hasAttribute('aria-describedby', description.id);

        if (options.textContent) {
          Qunit.assert.dom(description).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert
            .dom(description)
            .hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.Visible: {
        if (description === null) {
          Qunit.assert.notEqual(description, null);

          return;
        }

        if (dialog === null) {
          Qunit.assert.notEqual(dialog, null);

          return;
        }

        assertVisible(description);

        Qunit.assert.dom(description).hasAttribute('id');
        Qunit.assert
          .dom(dialog)
          .hasAttribute('aria-describedby', description.id);

        if (options.textContent) {
          Qunit.assert.dom(description).hasText(options.textContent);
        }

        for (let attributeName in options.attributes) {
          let attributeValue = options.attributes[attributeName];

          if (attributeName === 'class') {
            attributeValue = `ember-view ${attributeValue}`;
          }

          if (attributeName === 'id') {
            attributeValue = new RegExp(`${attributeValue}$`);
          }

          Qunit.assert
            .dom(description)
            .hasAttribute(attributeName, attributeValue);
        }

        break;
      }

      case DialogState.InvisibleUnmounted: {
        Qunit.assert.strictEqual(description, null);

        break;
      }

      default: {
        assertNever(options.state);
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertDialogDescription);
    throw err;
  }
}

function getByText(text) {
  let walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.children.length > 0) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim() === text) {
      return walker.currentNode;
    }
  }

  return null;
}

function assertListboxButton(
  { state, attributes, textContent },
  button = getListboxButton()
) {
  try {
    if (button === null) return Qunit.assert.ok(button);
    Qunit.assert.dom(button).hasAttribute('id');
    Qunit.assert.dom(button).hasAria('haspopup', 'listbox');
    if (textContent) {
      Qunit.assert.dom(button).hasText(textContent);
    }
    switch (state) {
      case ListboxState.InvisibleUnmounted: {
        Qunit.assert.dom(button).doesNotHaveAria('listbox');
        if (button.hasAttribute('disabled')) {
          Qunit.assert.dom(button).doesNotHaveAria('expanded');
          Qunit.assert.dom(button).isDisabled();
        } else {
          Qunit.assert.dom(button).hasAria('expanded', 'false');
        }
        break;
      }
      case ListboxState.Visible: {
        Qunit.assert.dom(button).hasAria('controls', { any: true });
        Qunit.assert.dom(button).hasAria('expanded', 'true');
        break;
      }
      default:
        Qunit.assert.ok(
          state,
          'you have to provide state to assertListboxButton'
        );
    }

    for (let attributeName in attributes) {
      Qunit.assert
        .dom(button)
        .hasAttribute(attributeName, attributes[attributeName]);
    }
  } catch (err) {
    Error.captureStackTrace(err, assertListboxButton);
    throw err;
  }
}

function assertListboxLabelLinkedWithListbox(
  label = getListboxLabel(),
  listbox = getListbox()
) {
  try {
    if (label === null) return Qunit.assert.ok(label);
    if (listbox === null) return Qunit.assert.ok(listbox);

    Qunit.assert
      .dom(listbox)
      .hasAttribute('aria-labelledby', label.getAttribute('id'));
  } catch (err) {
    Error.captureStackTrace(err, assertListboxLabelLinkedWithListbox);
    throw err;
  }
}

function assertListboxButtonLinkedWithListbox(
  button = getListboxButton(),
  listbox = getListbox()
) {
  try {
    if (button === null) return Qunit.assert.ok(button);
    if (listbox === null) return Qunit.assert.ok(listbox);

    // Ensure link between button & listbox is correct
    Qunit.assert
      .dom(button)
      .hasAttribute('aria-controls', listbox.getAttribute('id'));
    Qunit.assert
      .dom(listbox)
      .hasAttribute('aria-labelledby', button.getAttribute('id'));
  } catch (err) {
    Error.captureStackTrace(err, assertListboxButtonLinkedWithListbox);
    throw err;
  }
}

function assertActiveListboxOption(item, listbox = getListbox()) {
  try {
    if (item === null) return Qunit.assert.ok(item);
    if (listbox === null) return Qunit.assert.ok(listbox);

    // Ensure link between listbox & listbox item is correct
    Qunit.assert
      .dom(listbox)
      .hasAttribute('aria-activedescendant', item.getAttribute('id'));
  } catch (err) {
    Error.captureStackTrace(err, assertActiveListboxOption);
    throw err;
  }
}

function assertActiveComboboxOption(item, combobox = getCombobox()) {
  try {
    if (item === null) return Qunit.assert.ok(item);
    if (combobox === null) return Qunit.assert.ok(combobox);

    // Ensure link between combobox & combobox item is correct
    Qunit.assert
      .dom(combobox)
      .hasAttribute('aria-activedescendant', item.getAttribute('id'));
  } catch (err) {
    Error.captureStackTrace(err, assertActiveComboboxOption);
    throw err;
  }
}

function assertNoActiveListboxOption(listbox = getListbox()) {
  try {
    if (listbox === null) return Qunit.assert.ok(listbox);

    // Ensure we don't have an active listbox
    Qunit.assert.dom(listbox).doesNotHaveAttribute('aria-activedescendant');
  } catch (err) {
    Error.captureStackTrace(err, assertNoActiveListboxOption);
    throw err;
  }
}

function assertNoSelectedListboxOption(items = getListboxOptions()) {
  try {
    for (let item of items)
      Qunit.assert.dom(item).hasAttribute('aria-selected', 'false');
  } catch (err) {
    Error.captureStackTrace(err, assertNoSelectedListboxOption);
    throw err;
  }
}

function assertListboxButtonLinkedWithListboxLabel(
  button = getListboxButton(),
  label = getListboxLabel()
) {
  try {
    if (button === null) return Qunit.assert.ok(button);
    if (label === null) return Qunit.assert.ok(label);

    // Ensure link between button & label is correct
    Qunit.assert
      .dom(button)
      .hasAttribute('aria-labelledby', `${label.id} ${button.id}`);
  } catch (err) {
    Error.captureStackTrace(err, assertListboxButtonLinkedWithListboxLabel);
    throw err;
  }
}

function assertListboxLabel(
  { attributes, tag, textContent },
  label = getListboxLabel()
) {
  try {
    if (label === null) return Qunit.assert.ok(label);

    // Ensure menu button have these properties
    Qunit.assert.dom(label).hasAttribute('id');

    if (textContent) {
      Qunit.assert.dom(label).hasText(textContent);
    }

    if (tag) {
      Qunit.assert.dom(label).hasTagName(tag);
    }

    // Ensure menu button has the following attributes
    for (let attributeName in attributes) {
      Qunit.assert
        .dom(label)
        .hasAttribute(attributeName, attributes[attributeName]);
    }
  } catch (err) {
    Error.captureStackTrace(err, assertListboxLabel);
    throw err;
  }
}

export function assertListboxOption({ tag, attributes, selected }, item) {
  try {
    if (item === null) return Qunit.assert.notOk(item);

    // Check that some attributes exists, doesn't really matter what the values are at this point in
    // time, we just require them.
    Qunit.assert.dom(item).hasAttribute('id');

    // Check that we have the correct values for certain attributes
    Qunit.assert.dom(item).hasAttribute('role', 'option');
    if (!item.getAttribute('aria-disabled'))
      Qunit.assert.dom(item).hasAttribute('tabindex', '-1');

    // Ensure listbox button has the following attributes
    if (!tag && !attributes && selected === undefined) return;

    for (let attributeName in attributes) {
      Qunit.assert
        .dom(item)
        .hasAttribute(attributeName, attributes[attributeName]);
    }

    if (tag) {
      Qunit.assert.dom(item).hasTagName(tag);
    }

    if (selected != null) {
      switch (selected) {
        case true:
          return Qunit.assert.dom(item).hasAttribute('aria-selected', 'true');

        case false:
          return Qunit.assert.dom(item).hasAttribute('aria-selected', 'false');

        default:
          Qunit.assert.ok();
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertListboxOption);
    throw err;
  }
}

function assertListbox(
  { state, attributes, textContent, mode },
  listbox = getListbox(),
  orientation = 'vertical'
) {
  try {
    switch (state) {
      case ListboxState.InvisibleHidden: {
        if (listbox === null) return Qunit.assert.dom(listbox).exists();

        assertHidden(listbox);

        Qunit.assert.dom(listbox).hasAria('labelledby');
        Qunit.assert.dom(listbox).hasAria('orientation', orientation);
        Qunit.assert.dom(listbox).hasAttribute('role', 'listbox');

        if (textContent) Qunit.assert.dom(listbox).hasText(textContent);

        for (let attributeName in attributes) {
          Qunit.assert
            .dom(listbox)
            .hasAttribute(attributeName, attributes[attributeName]);
        }
        break;
      }
      case ListboxState.InvisibleUnmounted: {
        Qunit.assert.dom(listbox).doesNotExist();
        break;
      }
      case ListboxState.Visible: {
        // Qunit.assert.dom(listbox).isVisible();
        Qunit.assert.dom(listbox).exists();

        Qunit.assert.dom(listbox).hasAria('labelledby', { any: true });
        Qunit.assert.dom(listbox).hasAttribute('aria-orientation', orientation);
        Qunit.assert.dom(listbox).hasAttribute('role', 'listbox');

        if (mode && mode === ListboxMode.Multiple) {
          Qunit.assert
            .dom(listbox)
            .hasAttribute('aria-multiselectable', 'true');
        }

        if (textContent) Qunit.assert.dom(listbox).hasText(textContent);

        for (let attributeName in attributes) {
          Qunit.assert
            .dom(listbox)
            .hasAttribute(attributeName, attributes[attributeName]);
        }
        break;
      }
      default:
        Qunit.assert.ok(state, 'you have to provide state to assertListbox');
    }
  } catch (err) {
    Error.captureStackTrace(err, assertListbox);
    throw err;
  }
}

function assertComboboxOption({ tag, attributes, selected }, item) {
  try {
    if (item === null) return Qunit.assert.dom(item).exists();

    // Check that some attributes exists, doesn't really matter what the values are at this point in
    // time, we just require them.
    Qunit.assert.dom(item).hasAttribute('id');

    // Check that we have the correct values for certain attributes
    Qunit.assert.dom(item).hasAttribute('role', 'option');

    if (!item.getAttribute('aria-disabled')) {
      Qunit.assert.dom(item).hasAttribute('tabindex', '-1');
    }

    // Ensure combobox button has the following attributes
    for (let attributeName in attributes) {
      Qunit.assert
        .dom(item)
        .hasAttribute(attributeName, attributes[attributeName]);
    }

    if (tag) {
      Qunit.assert.dom(item).hasTagName(tag.toLowerCase());
    }

    if (selected != null) {
      switch (selected) {
        case true:
          return Qunit.assert.dom(item).hasAttribute('aria-selected', 'true');

        case false:
          return Qunit.assert.dom(item).hasAttribute('aria-selected', 'false');

        default:
          Qunit.assert.ok();
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertComboboxOption);
    throw err;
  }
}

function assertNoSelectedComboboxOption(items = getComboboxOptions()) {
  try {
    for (let item of items)
      Qunit.assert.dom(item).hasAttribute('aria-selected', 'false');
  } catch (err) {
    Error.captureStackTrace(err, assertNoSelectedComboboxOption);
    throw err;
  }
}

function assertNoActiveComboboxOption(combobox = getComboboxInput()) {
  try {
    if (combobox === null) return Qunit.assert.dom(combobox).exists();

    // Ensure we don't have an active combobox
    Qunit.assert.dom(combobox).doesNotHaveAttribute('aria-activedescendant');
  } catch (err) {
    Error.captureStackTrace(err, assertNoActiveComboboxOption);
    throw err;
  }
}

function assertNotActiveComboboxOption(item, combobox = getComboboxInput()) {
  try {
    if (combobox === null) return Qunit.assert.dom(combobox).exists();
    if (item === null) return Qunit.assert.dom(item).exists();

    // Ensure link between combobox & combobox item does not exist
    Qunit.assert
      .dom(combobox)
      .doesNotHaveAttribute('aria-activedescebdabt', item.getAttribute('id'));
  } catch (err) {
    Error.captureStackTrace(err, assertNotActiveComboboxOption);
    throw err;
  }
}

function assertComboboxButton(
  { state, attributes, textContent },
  button = getComboboxButton()
) {
  try {
    if (button === null) return Qunit.assert.ok(button);
    Qunit.assert.dom(button).hasAttribute('id');
    Qunit.assert.dom(button).hasAria('haspopup', 'listbox');
    if (textContent) {
      Qunit.assert.dom(button).hasText(textContent);
    }
    switch (state) {
      case ComboboxState.InvisibleHidden: {
        Qunit.assert.dom(button).hasAria('controls', { any: true });
        if (button.hasAttribute('disabled')) {
          Qunit.assert.dom(button).doesNotHaveAria('expanded');
        } else {
          Qunit.assert.dom(button).hasAria('expanded', 'false');
        }
        break;
      }
      case ComboboxState.InvisibleUnmounted: {
        Qunit.assert.dom(button).doesNotHaveAria('controls');
        if (button.hasAttribute('disabled')) {
          Qunit.assert.dom(button).doesNotHaveAria('expanded');
          Qunit.assert.dom(button).isDisabled();
        } else {
          Qunit.assert.dom(button).hasAria('expanded', 'false');
        }
        break;
      }
      case ComboboxState.Visible: {
        Qunit.assert.dom(button).hasAria('controls', { any: true });
        Qunit.assert.dom(button).hasAria('expanded', 'true');
        break;
      }
      default:
        Qunit.assert.ok(
          state,
          'you have to provide state to assertComboboxButton'
        );
    }

    if (textContent) {
      Qunit.assert.dom(button).hasText(textContent);
    }

    for (let attributeName in attributes) {
      Qunit.assert
        .dom(button)
        .hasAttribute(attributeName, attributes[attributeName]);
    }
  } catch (err) {
    Error.captureStackTrace(err, assertComboboxButton);
    throw err;
  }
}

function assertComboboxList(
  { state, attributes, textContent },
  listbox = getCombobox()
) {
  try {
    switch (state) {
      case ComboboxState.InvisibleHidden: {
        if (listbox === null) return Qunit.assert.ok(listbox);

        assertHidden(listbox);

        Qunit.assert.dom(listbox).hasAria('labelledby');
        Qunit.assert.dom(listbox).hasAttribute('role', 'listbox');

        if (textContent) {
          Qunit.assert.dom(listbox).hasText(textContent);
        }

        for (let attributeName in attributes) {
          Qunit.assert
            .dom(listbox)
            .hasAttribute(attributeName, attributes[attributeName]);
        }

        break;
      }

      case ComboboxState.Visible: {
        if (listbox === null) return Qunit.assert.ok(listbox);

        assertVisible(listbox);

        Qunit.assert.dom(listbox).hasAttribute('aria-labelledby');
        Qunit.assert.dom(listbox).hasAttribute('role', 'listbox');

        if (textContent) {
          Qunit.assert.dom(listbox).hasText(textContent);
        }

        for (let attributeName in attributes) {
          Qunit.assert
            .dom(listbox)
            .hasAttribute(attributeName, attributes[attributeName]);
        }

        break;
      }

      case ComboboxState.InvisibleUnmounted: {
        Qunit.assert.strictEqual(listbox, null);
        break;
      }

      default: {
        assertNever(state);
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertComboboxButton);
    throw err;
  }
}

function assertComboboxLabel(
  { tag, attributes, textContent },
  label = getComboboxLabel()
) {
  try {
    if (label === null) return Qunit.assert.ok(label);

    // Ensure menu button have these properties
    Qunit.assert.dom(label).hasAttribute('id');

    if (textContent) {
      Qunit.assert.dom(label).hasText(textContent);
    }

    if (tag) {
      Qunit.assert.dom(label).hasTagName(tag.toLowerCase());
    }

    // Ensure menu button has the following attributes
    for (let attributeName in attributes) {
      Qunit.assert
        .dom(label)
        .hasAttribute(attributeName, attributes[attributeName]);
    }
  } catch (err) {
    Error.captureStackTrace(err, assertComboboxLabel);
    throw err;
  }
}

function assertComboboxLabelLinkedWithCombobox(
  label = getComboboxLabel(),
  combobox = getCombobox()
) {
  try {
    if (label === null) return Qunit.assert.ok(label);
    if (combobox === null) return Qunit.assert.ok(combobox);

    // Ensure link between button & combobox is correct
    Qunit.assert.dom(combobox).hasAria('labelledby', label.getAttribute('id'));
  } catch (err) {
    Error.captureStackTrace(err, assertComboboxLabelLinkedWithCombobox);
    throw err;
  }
}

function assertComboboxButtonLinkedWithCombobox(
  button = getComboboxButton(),
  combobox = getCombobox()
) {
  try {
    if (button === null) return Qunit.assert.ok(button);
    if (combobox === null) return Qunit.assert.ok(combobox);

    Qunit.assert.dom(button).hasAria('controls', combobox.getAttribute('id'));
    Qunit.assert.dom(combobox).hasAria('labelledby', button.getAttribute('id'));
  } catch (err) {
    Error.captureStackTrace(err, assertComboboxButtonLinkedWithCombobox);
    throw err;
  }
}

function assertComboboxButtonLinkedWithComboboxLabel(
  button = getComboboxButton(),
  label = getComboboxLabel()
) {
  try {
    if (button === null) return Qunit.assert.ok(button);
    if (label === null) return Qunit.assert.ok(label);

    // Ensure link between button & label is correct
    Qunit.assert
      .dom(button)
      .hasAria(
        'labelledby',
        label.getAttribute('id') + ' ' + button.getAttribute('id')
      );
  } catch (err) {
    Error.captureStackTrace(err, assertComboboxButtonLinkedWithComboboxLabel);
    throw err;
  }
}

function assertCombobox(
  { attributes, textContent, state, mode },
  combobox = getComboboxInput()
) {
  try {
    switch (state) {
      case ComboboxState.InvisibleHidden: {
        if (combobox === null) return Qunit.assert.ok(combobox);

        assertHidden(combobox);

        Qunit.assert.dom(combobox).hasAttribute('role', 'combobox');

        if (textContent) {
          Qunit.assert.dom(combobox).hasText(textContent);
        }

        for (let attributeName in attributes) {
          Qunit.assert
            .dom(combobox)
            .hasAttribute(attributeName, attributes[attributeName]);
        }

        break;
      }
      case ComboboxState.Visible: {
        if (combobox === null) return Qunit.assert.ok(combobox);

        assertVisible(combobox);

        Qunit.assert.dom(combobox).hasAttribute('role', 'combobox');

        if (mode && mode === ComboboxMode.Multiple) {
          Qunit.assert.dom(combobox).hasAria('multiselectable', 'true');
        }

        if (textContent) {
          Qunit.assert.dom(combobox).hasText(textContent);
        }

        for (let attributeName in attributes) {
          Qunit.assert
            .dom(combobox)
            .hasAttribute(attributeName, attributes[attributeName]);
        }

        break;
      }
      case ComboboxState.InvisibleUnmounted: {
        Qunit.assert.strictEqual(combobox, null);

        break;
      }
      default: {
        assertNever(state);
      }
    }
  } catch (err) {
    Error.captureStackTrace(err, assertCombobox);
    throw err;
  }
}

export {
  assertActiveComboboxOption,
  assertActiveElement,
  assertActiveListboxOption,
  assertCombobox,
  assertComboboxButton,
  assertComboboxButtonLinkedWithCombobox,
  assertComboboxButtonLinkedWithComboboxLabel,
  assertComboboxLabel,
  assertComboboxLabelLinkedWithCombobox,
  assertComboboxList,
  assertComboboxOption,
  assertDialog,
  assertDialogDescription,
  assertDialogOverlay,
  assertDialogTitle,
  assertFocusable,
  assertListbox,
  assertListboxButton,
  assertListboxButtonLinkedWithListbox,
  assertListboxButtonLinkedWithListboxLabel,
  assertListboxLabel,
  assertListboxLabelLinkedWithListbox,
  assertNoActiveComboboxOption,
  assertNoActiveListboxOption,
  assertNoSelectedComboboxOption,
  assertNoSelectedListboxOption,
  assertNotActiveComboboxOption,
  assertNotFocusable,
  assertRadioGroupLabel,
  ComboboxMode,
  ComboboxState,
  DialogState,
  getByText,
  getCombobox,
  getComboboxButton,
  getComboboxButtons,
  getComboboxes,
  getComboboxInput,
  getComboboxInputs,
  getComboboxLabel,
  getComboboxOptions,
  getDialog,
  getDialogOverlay,
  getDialogOverlays,
  getDialogs,
  getListbox,
  getListboxButton,
  getListboxButtons,
  getListboxes,
  getListboxLabel,
  getListboxOptions,
  getRadioGroupOptions,
  ListboxMode,
  ListboxState,
};
