import { ILotItem } from '../../types/index';
import { handlePrice } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

/*
 * Интерфейс, описывающий корзину товаров
 * */
export interface IBasket {
	list: HTMLElement[];
	price: number;
	selected: string[];
}

/**Класс, описывающий корзину товаров */
export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	// Конструктор принимает имя блока, родительский элемент и обработчик событий
	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._button = container.querySelector(`.${blockName}__button`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._list = container.querySelector(`.${blockName}__list`);

		if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:order')
			);
		}
	}

	// Сеттер для общей цены
	set price(price: number) {
		this._price.textContent = handlePrice(price) + ' синапсов';
	}

	/**Список товаров*/
	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this._button.disabled = items.length ? false : true;
	}

	/** Метод отключающий кнопку */
	disableButton() {
		this._button.disabled = true;
	}

	/**Метод для обновления индексов при удалении товара из корзины */
	refreshIndices() {
		Array.from(this._list.children).forEach(
			(item, index) =>
				(item.querySelector(`.basket__item-index`)!.textContent = (
					index + 1
				).toString())
		);
	}
}

export interface IProductBasket extends ILotItem {
	id: string;
	index: number;
}

export interface IItemsBasket {
	onClick: (event: MouseEvent) => void;
}

export class CatalogItemsBasket extends Component<IProductBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IItemsBasket
	) {
		super(container);

		this._title = container.querySelector(`.${blockName}__title`);
		this._index = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set price(value: number) {
		this._price.textContent = handlePrice(value) + ' синапсов';
	}
}
