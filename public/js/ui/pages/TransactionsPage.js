/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Параметр element класса TransactionsPage не задан');
    }
    this.element = element;

    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const deleteAccount = this.element.querySelector('.remove-account');

    deleteAccount.onclick = () => this.removeAccount();

    const clickHandler = (event) => {
      const target = event.target.closest('.transaction__remove');

      if (target) {
        this.removeTransaction(target.dataset.id);
      }
    }

    this.element.addEventListener('click', clickHandler);
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const confirmation = window.confirm('Вы действительно хотите удалить счёт?');

      if (confirmation) {
        const callback = (error) => {
          if (error) {
            handleError(error);
          } else {
            App.updateWidgets();
            this.clear();
          }
        }

        Account.remove({id: this.lastOptions.account_id}, callback);
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const confirmation = window.confirm('Вы действительно хотите удалить эту транзакцию?');

    if (confirmation) {
      const callback = (error) => {
        if (error) {
          handleError(error);
        } else {
          App.getWidget("accounts").update();
          this.update();
        }
      }

      Transaction.remove({id}, callback);
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;

      let callback = (error, response) => {
        if (error) {
          handleError(error);
        } else {
          this.renderTitle(response.data.name);
        }
      }

      Account.get(options.account_id, callback);

      callback = (error, response) => {
        if (error) {
          handleError(error);
        } else {
          this.renderTransactions(response.data);
        }
      };

      Transaction.list(options.account_id, callback);
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const contentTitle = this.element.querySelector('.content-title');

    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const fullDate = new Date(date);
    const options = {dateStyle: 'long', timeStyle: 'short'};
    const formatedDate = new Intl.DateTimeFormat('ru-RU', options).format(fullDate);

    return formatedDate.split(',').join(' в ');
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__sum">
            ${item.sum}
            <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>
            </button>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let html = '';

    for (const item of data) {
      html += this.getTransactionHTML(item);
    }

    const content = this.element.querySelector('.content');
    content.textContent = '';

    content.insertAdjacentHTML('beforeend', html);
  }
}