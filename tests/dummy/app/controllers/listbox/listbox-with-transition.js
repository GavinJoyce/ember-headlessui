import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const PEOPLE = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
];

export default class ListboxWithTransitionController extends Controller {
  @tracked selectedPerson = PEOPLE[0];

  get people() {
    return PEOPLE;
  }

  @action
  setSelectedPerson(person) {
    this.selectedPerson = person;
  }
}
