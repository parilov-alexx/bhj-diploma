/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    sidebarToggle.onclick = () => {
      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    }
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регистрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const menuItems = document.getElementsByClassName('menu-item');

    for (const item of menuItems) {
      let handler;

      if (item.classList.contains('menu-item_login')) {
        handler = () => {
          App.getModal('login').open();
        }
      } else if (item.classList.contains('menu-item_register')) {
        handler = () => {
          App.getModal('register').open();
        }
      } else if (item.classList.contains('menu-item_logout')) {
        handler = () => {
          const callback = (error) => {
            if (error) {
              handleError(error);
            } else {
              App.setState('init');
            }
          };

          User.logout(User.current(), callback);
        }
      }

      item.onclick = handler;
    }
  }
}