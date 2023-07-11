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
  constructor( element ) {
    if (!element) 
    throw new Error('Пустой элемент в конструкторе класса TransactionsPage');  
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
    this.element.querySelector('.remove-account').addEventListener('click', e => {
      e.preventDefault();
      this.removeAccount();
    });

    for (const button of this.element.querySelectorAll('.transaction__remove'))
      button.addEventListener('click', e => {
        e.preventDefault();
        this.removeTransaction(button.dataset.id);
      });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(!this.lastOptions)
    return;
  if(!confirm('Вы действительно хотите удалить этот счёт?'))
    return;
  Account.remove(this.lastOptions.account_id, {}, (err, response) => {
    
    if (err) {
      alert(JSON.stringify(err));
      return;
    }   
    if (!response.success) {
      alert(JSON.stringify(response));
      return;
    }  
    
    this.clear();
    App.update();
    
  });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(!confirm('Вы действительно хотите удалить эту транзакцию?'))
    return;
  
  Transaction.remove(id, {}, (err, response) => {
    
    if (err) {
      alert(JSON.stringify(err));
      return;
    }   
    if (!response.success) {
      alert(JSON.stringify(response));
      return;
    }  
    
    App.update();
    
  });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options)
    return;
  this.lastOptions = options;
  
  Account.get(options.account_id, User.current(), (err, response) => {
    if (err) {
      alert(JSON.stringify(err));
      return;
    }   
    if (!response.success) {
      alert(JSON.stringify(response));
      return;
    }  
    
    this.renderTitle(response.data.name);  
    
    Transaction.list({ account_id: response.data.id }, (err, response) => {     
      if (err) {
        alert(JSON.stringify(err));
        return;
      }  
      if (!response.success) {
        alert(JSON.stringify(response));
        return;
      }  
    
      this.renderTransactions(response.data);      
    });
   
  });
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
  renderTitle(name){
    this.element.querySelector('.content-title').innerHTML = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const monthNames = [
      'января', 
      'февраля',
      'марта', 
      'апреля', 
      'мая', 
      'июня', 
      'июля', 
      'августа', 
      'сентября', 
      'октября', 
      'ноября', 
      'декабря'
    ];
    
    let month;
    month = monthNames[date.slice(5,7) - 1];
    if (!month)
      month = '*****';
    
    return(`${date.slice(8,10)} ${month} ${date.slice(0,4)} г. в ${date.slice(11,16)}`);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type.toLowerCase() === 'income' ? 'income' : 'expense'} row">
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
      <div class="transaction__summ">
        <!--  сумма -->
        ${item.sum} <span class="currency">\u20bd</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
      <!-- в data-id нужно поместить id -->
      <button class="btn btn-danger transaction__remove" data-id="${item.id}">
        <i class="fa fa-trash"></i>  
      </button>
    </div>
  </div>`;    
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    let transactions = '';
    for (const item of data)
      transactions += this.getTransactionHTML(item);
    this.element.querySelector('.content').innerHTML = transactions;

    for (const button of this.element.querySelectorAll('.transaction__remove'))
      button.addEventListener('click', e => {
        e.preventDefault();
        this.removeTransaction(button.dataset.id);
      });
  }
}