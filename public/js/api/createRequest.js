/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options) => {
  if (!options) {
    throw new Error('Параметр options функции createRequest не задан');
  }

  let {url, headers, data, responseType, method, callback} = options;
  const xhr = new XMLHttpRequest();

  try {
    xhr.open(method, url);
    xhr.responseType = responseType;
    xhr.withCredentials = true;

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
    }

    xhr.onloadend = () => {
      if (String(xhr.status).startsWith('2')) {
        callback(xhr.response?.error, xhr.response);
      } else {
        let content = 'Сервер не принял запрос. ';
        content += `Ошибка ${xhr.status}: ${xhr.statusText}.`;
        console.error(content);
      }
    }

    if (data === undefined) {
      xhr.send();
    } else {
      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }

      xhr.send(formData);
    }
  }
  catch (e) {
    console.error(e);
  }
};