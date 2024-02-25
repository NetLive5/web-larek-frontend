import { ensureAllElements } from '../../utils/utils';
import { Component } from '../base/Component';
/**
 * TabState описывает состояние вкладок и содержит свойство selected, которое указывает на имя выбранной вкладки.
 */
export type TabState = {
	selected: string;
};
/**
 * TabActions определяет доступные действия для вкладок и содержит функцию onClick, которая вызывается при щелчке на вкладке и принимает имя выбранной вкладки.
 */
export type TabActions = {
	onClick: (tab: string) => void;
};

/**
 * Представляет собой компонент для управления вкладками в корзине
 */
export class Tabs extends Component<TabState> {
	protected _buttons: HTMLButtonElement[];

	/**
	 *
	 * @param container Конструктор класса принимает элемент контейнера
	 * @param actions и действия для вкладок
	 */
	constructor(container: HTMLElement, actions?: TabActions) {
		super(container);

		this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				actions?.onClick?.(button.name);
			});
		});
	}

	/**
	 * Этот setter позволяет установить выбранную вкладку по ее имени.
	 */
	set selected(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'tabs__item_active', button.name === name);
			this.setDisabled(button, button.name === name);
		});
	}
}
