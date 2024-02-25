import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IFormState {
	valid: boolean;
	errors: string[];
}

/**Форма с полями*/
export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		// _submit (кнопка отправки формы) и _errors (контейнер для отображения ошибок)
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		// Передает имя поля и его значение
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
		console.log(`${this.container.name}.${String(field)}:change`);
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	clearFields() {
		const inputFields = Array.from(
			this.container.querySelectorAll('input, textarea')
		);
		inputFields.forEach((field: HTMLInputElement | HTMLTextAreaElement) => {
			field.value = ''; // Очищаем значение поля ввода
		});
	}

	/** @param state представляет текущее состояние формы */
	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
