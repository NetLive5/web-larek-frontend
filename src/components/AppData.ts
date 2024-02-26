import _ from 'lodash';
import { FormErrors, IAppState, ILotItem, IOrder, IOrderForm } from '../types';
import { Model } from './base/Model';

export class CLotItem extends Model<ILotItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	selected: boolean;
}

export type CatalogChangeEvent = {
	catalog: ILotItem[];
};
/**Класс, описывающий состояние приложения */
export class AppState extends Model<IAppState> {
	basket: CLotItem[] = [];
	catalog: ILotItem[];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		total: null,
		payment: '',
		address: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	toggleOrderedLot(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c)?.price || 0,
			0
		);
	}

	clearBasket() {
		this.order.items.forEach((id) => {
			this.toggleOrderedLot(id, false);
		});
		this.basket = [];
	}

	setCatalog(items: ILotItem[]) {
		this.catalog = items.map((item) => ({ ...item }));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ILotItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContactInfo()) {
			this.events.emit('contacts:ready', this.order);
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactInfo() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	addToBasket(value: CLotItem) {
		this.basket.push(value);
	}

	getBasketAmount() {
		return this.basket.length;
	}

	getTotalBasketPrice() {
		return this.basket.reduce((sum, next) => sum + next.price, 0);
	}

	deleteFromBasket(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
	}

	setItems() {
		this.order.items = this.basket.map((item) => item.id);
	}

	refreshOrder() {
		this.order = {
			items: [],
			total: null,
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
	}
}
