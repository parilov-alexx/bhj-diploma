/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(options.data, (err, response) => {
      
      if (err) {
        alert(JSON.stringify(err));
        return;
      }
   
      if (!response.success) {
        alert(JSON.stringify(response));
        return;
      } 
      
      for (const input of this.element.querySelectorAll('input'))
        input.value = '';
      
      App.setState('user-logged');
      App.getModal(this.element.closest('.modal').dataset.modalId).close();
    });
  }
}