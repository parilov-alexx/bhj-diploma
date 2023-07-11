/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */
  static URL = '/account';
  static get(id = '', data, callback = f => f) {
    return createRequest({
      url: this.URL + '/' + id,
      data, 
      responseType: 'json',
      method: 'GET',
      callback
    });    
  }
}
