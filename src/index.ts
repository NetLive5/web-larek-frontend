import { AppState, CLotItem, CatalogChangeEvent } from './components/AppData';
import { CatalogItem } from './components/Card';
import { Contacts } from './components/Contact';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { AuctionAPI } from './components/ShopAPI';
import { ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket, CatalogItemsBasket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import './scss/styles.scss';
import { ILotItem, IOrderForm, LotCategory } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppState({}, events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

//Вывод карточек
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item: ILotItem) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		card.setCategoryStatus({
			category: item.category as LotCategory,
			label: item.category,
		});

		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Открытие карточки
events.on('card:select', (item: ILotItem) => {
	appData.setPreview(item);
});

// Просмотр карточки
let card: CatalogItem;
events.on('preview:changed', (item: ILotItem) => {
	const showItem = (item: ILotItem) => {
		card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				events.emit('card:basket', item);
				console.log('card:basket');
			},
		});
		card.setCategoryStatus({
			category: item.category as LotCategory,
			label: item.category,
		});
		console.log(item);
		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				description: item.description.split('\n'),
				price: item.price,
			}),
		});
	};

	if (item) {
		api
			.getLotItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// Добавление товара в корзину
events.on('card:basket', (item: CLotItem) => {
	item.selected = true;
	appData.addToBasket(item);
	page.counter = appData.getBasketAmount();
	modal.close();
});

//Открытие корзины
events.on('basket:open', () => {
	const basketItems = appData.basket.map((item, index) => {
		const catalogItem = new CatalogItemsBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:deleteItem', item),
			}
		);
		return catalogItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			list: basketItems,
			price: appData.getTotalBasketPrice(),
		}),
	});
});

// Удалить товар из корзины
events.on('basket:deleteItem', (item: ILotItem) => {
	console.log('basket:deleteItem');
	appData.deleteFromBasket(item.id);
	basket.price = appData.getTotalBasketPrice();
	page.counter = appData.getBasketAmount();
	if (appData.basket.length === 0) {
		basket.disableButton();
	}
});

// Оформить заказ
events.on('basket:order', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Следит за обновление полей адреса и выбора оплаты
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Следит за обновление полей номер и email
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

//Заполнение полей
events.on('order:submit', () => {
	appData.order.total = appData.getTotalBasketPrice();
	appData.setItems();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Покупка товаров
events.on('contacts:submit', () => {
	api
		.post('/order', appData.order)
		.then((res) => {
			events.emit('order:success', res);
			appData.clearBasket();
			appData.refreshOrder();
			order.disableButtons();
			contacts.clearFields();
			order.clearFields();
			page.counter = 0;
		})
		.catch((err) => {
			console.log(err);
		});
});

// Окно успешной покупки
events.on('order:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			description: res.total,
		}),
	});
});

//Заблокировать прокрут модального
events.on('modal:open', () => {
	page.locked = true;
});

//Разрешить прокрут модального окна
events.on('modal:close', () => {
	page.locked = false;
});

//Запрос на сервер что бы получить массив карточек
api
	.getLotList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
