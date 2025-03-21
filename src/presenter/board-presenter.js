import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import FormCreationView from '../view/form-creation-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView(); // (new) Создается экземпляр компонента
  eventListComponent = new EventListView();

  constructor({container, pointModel}) {
    this.container = container;
    this.pointModel = pointModel;
  }

  init() { // метод инициализирует компоненты и отображает их на странице
    this.eventPoints = [...this.pointModel.getPoints()]; // Создается новый массив, который заполняется копией точек
    render(this.sortComponent, this.container); // Компоненты добавляются в контейнер
    render(this.eventListComponent, this.container);

    render(new FormEditView({ //Отображение формы редактирования с параметрами:
      points: this.eventPoints[0], //первая точка из нового массива точек
      checkedOffers: this.pointModel.getOffersById(this.eventPoints[0].type, this.eventPoints[0].offers), //предложения, связанные с этой точкой, полученные по типу и айди
      offers: this.pointModel.getOffersByType(this.eventPoints[0].type), //все предложения по типу этой точки
      destinations: this.pointModel.getDestinationById(this.eventPoints[0].destination) //направление, связанное с этой точкой
    }), this.eventListComponent.getElement() //форма добавляется в элемент списка
    );

    render(new FormCreationView(), this.eventListComponent.getElement());

    for (let i = 1; i < this.eventPoints.length; i++) { // отображаем точки. Для каждой точки передаются:
      render(new PointView({
        points: this.eventPoints[i], //текущая точка
        offers: this.pointModel.getOffersById(this.eventPoints[i].type, this.eventPoints[i].offers), //предложения, связанные с этой точкой.
        destinations: this.pointModel.getDestinationById(this.eventPoints[i].destination)// направление, связанное с этой точкой.
      }),
      this.eventListComponent.getElement()); //каждая точка добавляется в элемент списка
    }
  }
}
