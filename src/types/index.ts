/**
 * Описывает один элемент продукта
 */
export interface ILotItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	selected: boolean;
	price: number | null;
}
/**Категории карточек*/
export type LotCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'кнопка'
	| 'дополнительное';

/**
 * Интерфейс, описывающий состояние приложения, включая каталог лотов, корзину, превью, информацию о заказе и состояние загрузки.
 */
export interface IAppState {
	catalog: ILotItem[]; // Карточки
	basket: string[]; // Корзина
	preview: string | null; // Показ карточки
	order: IOrder | null; // Информация о заказе при покупке товара
}

/**
 * Форма заказа | Интерфейс, описывающий форму для заполнения данных заказа, такие как электронная почта и номер телефона.
 */
export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

/**
 * Заказ | Интерфейс, описывающий заказ, включающий информацию о форме заказа и выбранных элементах.
 */
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

/**
 * Ошибки формы | Интерфейс, представляющий объект, содержащий сообщения об ошибках для каждого поля в форме заказа.
 */
export type FormErrors = Partial<Record<keyof IOrder, string>>;

/**
 * Результат заказа | Интерфейс, описывающий результат заказа, включая уникальный идентификатор заказа. И стоимость заказа
 */
export interface IOrderResult {
	id: string;
	total: number;
}
