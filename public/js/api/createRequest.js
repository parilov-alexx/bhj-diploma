/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const {url, headers, data, responseType, method, callback} = options;  
    const requestUrl = new URL('http:/localhost:8000' + url);

    if(method === 'GET') {
        for (const key in data) {
            requestUrl.searchParams.set(key, data[key]);
          }
    }
    const request = new XMLHttpRequest;
    request.withCredentials = true; 

    try {
        request.open(method, requestUrl);
        for (const header in headers) {
      request.setRequestHeader(header, headers[header])};
        request.responseType = 'json';
        if(method === 'GET') {
            request.send()
        } else {
            const formData = new FormData;
            for (const key in data) {
             formData.append(key, data[key])};
             request.send(formData);
        }
    } catch (error) {
        callback(error);
    }



request.addEventListener('readystatechange', function() {
    if (this.readyState !== this.DONE)  
      return;
          
    if (this.status === 200) { 
      callback(null, this.response);
    } else if (this.status) {
      callback({ status: this.status, statusText: this.statusText });
    } else {
      callback({ status: 0, statusText: 'Нет связи с сервером' });      
    }
  });
 
  return request;
};