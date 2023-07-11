/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(options) {
    User.login(options.data, (err, response) => {
      
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