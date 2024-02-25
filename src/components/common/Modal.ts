import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalData {
	content: HTMLElement;
}
/**Модальное окно */
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	/**
	 * В конструкторе класса инициализируются свойства _closeButton и _content, которые представляют кнопку закрытия модального окна и его содержимое соответственно.
	 * @param container Это элемент DOM, который представляет контейнер модального окна
	 * @param events Это объект событий, предоставляющий функциональность для обработки событий в приложении. В данном случае, он используется для генерации событий открытия и закрытия модального окна ('modal:open' и 'modal:close').
	 */
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		/* Свойство _content ищет элемент, представляющий содержимое модального окна.
		Свойство _closeButton инициализируется с помощью вызова функции ensureElement, которая ищет кнопку закрытия модального окна внутри контейнера и возвращает соответствующий элемент.*/

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}
	// устанавливает содержимое модального окна.
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}
	/**Открывает модальное окно */
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}
	/**Закрывает модальное окно */
	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}
	/**Отображает модальное окно с заданными данными */
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
