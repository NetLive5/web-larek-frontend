import clsx from 'clsx';
import { LotCategory } from '../types';
import { bem, ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	id: string;
	title: string;
	description: string | string[];
	image: string;
	status: T;
	category: string;
	price: number;
	selected: boolean;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLElement;
	protected _price?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._description = container.querySelector(`.${blockName}__text`);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);

		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set selected(value: boolean) {
		if (!this._button.disabled) {
			this._button.disabled = value;
			console.log(value);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	get category() {
		return this._category.textContent || '';
	}

	set category(value: string) {
		if (this._category) {
			this._category.textContent = value;
		}
	}

	get price(): number {
		return parseInt(this._price!.textContent || '0');
	}

	set price(value: number | null) {
		if (value === null) {
			this._price!.textContent = 'Бесценно';
			if (this._button) {
				this._button.disabled = true;
			}
		} else {
			if (this._button) {
				this._button.disabled = false;
			}
			this._price!.textContent = String(value) + ' синапсов';
		}
	}
}

export type CatalogItemStatus = {
	category: LotCategory;
	label: string;
};

export class CatalogItem extends Card<CatalogItemStatus> {
	protected _categoryElement: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._categoryElement = ensureElement<HTMLElement>(
			`.card__category`,
			container
		);

		this._button = container.querySelector(`.${this.blockName}__button`);
	}

	setCategoryStatus({ category, label }: CatalogItemStatus) {
		this.setText(this._categoryElement, label);
		this._categoryElement.className = clsx('card__category', {
			[bem(this.blockName, 'category', 'soft').name]: category === 'софт-скил',
			[bem(this.blockName, 'category', 'hard').name]: category === 'хард-скил',
			[bem(this.blockName, 'category', 'other').name]: category === 'другое',
			[bem(this.blockName, 'category', 'additional').name]:
				category === 'дополнительное',
			[bem(this.blockName, 'category', 'button').name]: category === 'кнопка',
		});
	}
}
