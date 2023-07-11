/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static URL = '';
  static list(data, callback = f => f){
    return createRequest({
      url: this.URL,
      data, 
      responseType: 'json',
      method: 'GET',
      callback
    });    
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    const newData = Object.assign({ _method: 'PUT' }, data);
    return createRequest({
      url: this.URL,
      data: newData, 
      responseType: 'json', 
      method: 'POST',
      callback
    });        
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback = f => f ) {
    const deleteData = Object.assign({ id, _method: 'DELETE' }, data);
    return createRequest({
      url: this.URL,
      data: deleteData, 
      responseType: 'json', 
      method: 'POST',
      callback
    }); 
  }
}
