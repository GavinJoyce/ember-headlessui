import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { action } from '@ember/object';

const PEOPLE = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
];

export default class ComboboxBasicController extends Controller {
  @tracked selectedPeople = PEOPLE;
  @tracked _filter = '';

  get people() {
    return PEOPLE;
  }

  get filteredPeople() {
    return PEOPLE.filter((person) => {
      return person.name.toLowerCase().includes(this._filter.toLowerCase());
    });
  }

  @action
  setSelectedPeople(people) {
    this.selectedPeople = people;
  }

  @action
  displayValue(people) {
    return people?.map && people.map((person) => person.name).join(', ');
  }

  @action
  applyFilter(event) {
    this._filter = event.target.value;
  }
}
