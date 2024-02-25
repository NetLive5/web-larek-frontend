# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Типы данных

- **ILotItem**: Описывает один элемент продукта.
- **LotCategory**: Категории карточек.
- **IAppState**: Интерфейс, описывающий состояние приложения, включая каталог лотов, корзину, превью, информацию о заказе и состояние загрузки.
- **IOrderForm**: Интерфейс, описывающий форму для заполнения данных заказа, такие как электронная почта и номер телефона.
- **IOrder**: Интерфейс, расширяющий IOrderForm, описывающий заказ, включающий информацию о форме заказа и выбранных элементах.
- **FormErrors**: Интерфейс, представляющий объект, содержащий сообщения об ошибках для каждого поля в форме заказа.
- **IOrderResult**: Интерфейс, описывающий результат заказа, включая уникальный идентификатор заказа и стоимость заказа.

# Классы

## Класс Component

Базовый компонент, предоставляющий интерфейс для взаимодействия с пользователем.

## Класс Page

Класс, описывающий главную страницу.

## Класс AppState extends Model

Класс, описывающий состояние приложения и предоставляет методы для управления им.

### Основные методы и свойства:

- `basket`: Массив товаров, добавленных в корзину.
- `catalog`: Массив всех товаров в каталоге.
- `loading`: Флаг, указывающий на состояние загрузки данных.
- `order`: Информация о заказе, включая email, телефон, список выбранных товаров, общую сумму, адрес и способ оплаты.
- `preview`: ID товара, выбранного для предварительного просмотра.
- `formErrors`: Объект с ошибками валидации формы.
- `toggleOrderedLot()`: Метод для добавления или удаления товара из заказа.
- `getTotal()`: Метод для расчета общей стоимости заказа.
- `clearBasket()`: Метод для очистки корзины.
- `setCatalog()`: Метод для установки каталога товаров.
- `setPreview()`: Метод для установки предварительного просмотра товара.
- `setOrderField()`: Метод для установки значений полей заказа и запуска валидации.
- `validateOrder()`: Метод для валидации информации о заказе.
- `validateContactInfo()`: Метод для валидации контактной информации.
- `addToBasket()`: Метод для добавления товара в корзину.
- `getBasketAmount()`: Метод для получения количества товаров в корзине.
- `getTotalBasketPrice()`: Метод для расчета общей стоимости товаров в корзине.
- `deleteFromBasket()`: Метод для удаления товара из корзины.
- `setItems()`: Метод для установки товаров из корзины в заказ.
- `refreshOrder()`: Метод для обновления информации о заказе, сбрасывая все значения в исходное состояние.

## Класс Card

Представляет карточку товара с изображением, названием, описанием, категорией, ценой и кнопкой действия. Он предоставляет методы для установки и получения данных карточки, а также для управления их отображением.

### Основные методы и свойства:

- `id`: Идентификатор карточки.
- `title`: Название товара.
- `description`: Описание товара.
- `image`: Изображение товара.
- `category`: Категория товара.
- `price`: Цена товара.
- `setCategoryStatus({ category, label })`: Метод для установки статуса категории товара и его отображения.

## CatalogItem

Класс CatalogItem расширяет функционал класса Card, добавляя возможность установки статуса категории товара и его отображения.

### Основные методы и свойства:

- `setCategoryStatus({ category, label })`: Метод для установки статуса категории товара и его отображения.

## Класс Order

Класс `Order` представляет собой форму заказа с полями для указания адреса доставки и выбора способа оплаты. Он расширяет функциональность класса `Form` и добавляет возможность выбора способа оплаты.

### Основные методы и свойства:

- **Конструктор**: `Order(container: HTMLFormElement, events: IEvents)`

  - Инициализирует экземпляр класса с родительским элементом формы и обработчиком событий.

- **\_card**: HTML-элемент кнопки для выбора оплаты картой.
- **\_cash**: HTML-элемент кнопки для выбора оплаты наличными.

- **disableButtons()**: Метод для отключения подсветки кнопок выбора способа оплаты.

## Класс Basket

Класс `Basket` описывает корзину товаров. Он предоставляет методы для отображения списка товаров, установки общей цены и отключения кнопки оформления заказа.

#### Свойства

- `_list`: Список товаров в корзине.
- `_price`: Общая цена товаров в корзине.
- `_button`: Кнопка оформления заказа.

### Методы

- `set price(price: number)`: Устанавливает общую цену товаров в корзине.
- `set list(items: HTMLElement[])`: Устанавливает список товаров в корзине и обновляет состояние кнопки оформления заказа.
- `disableButton()`: Отключает кнопку оформления заказа.
- `refreshIndices()`: Обновляет индексы товаров после удаления из корзины.

## Класс CatalogItemsBasket

Класс `CatalogItemsBasket` представляет отдельный товар в корзине. Он позволяет отображать название товара, его индекс, цену и предоставляет возможность удаления товара из корзины.

### Свойства

- `_title`: Название товара.
- `_index`: Индекс товара.
- `_price`: Цена товара.
- `_button`: Кнопка удаления товара из корзины.

### Методы

- `set title(value: string)`: Устанавливает название товара.
- `set index(value: number)`: Устанавливает индекс товара.
- `set price(value: number)`: Устанавливает цену товара.

## Класс Contacts

Класс описывает окно контакты

## AuctionAPI

Класс `AuctionAPI` предоставляет методы для взаимодействия с API аукционного сайта. Он позволяет получать список товаров, информацию о конкретном товаре и оформлять заказы.

### Методы

- `getLotList` получает список товаров
- `getLotItem` получает конкретный товар
- `orderLots` оформление товара / покупка
