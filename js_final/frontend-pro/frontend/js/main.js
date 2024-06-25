function startFunc() {
  const body = document.body;
  const createBody = createBodyFunc();
  let clientsList = [];

  createBody.mainButton.addEventListener('click', () => {

    const addWindow = createModalWindow([], "add");
    body.append(addWindow.modal);

    addWindow.modalXbutton.addEventListener('click', () => {
      addWindow.modal.remove();
      const allSelectBlock = document.getElementById('allselectblock');
      if (allSelectBlock) {
        allSelectBlock.innerHTML = '';
      }
      addWindow.modalAddButtonBlock.style.padding = "8px 30px";
      addWindow.modalAllSelectBlock.style.overflowY = "visible";
      addWindow.modalAllSelectBlock.style.height = "auto";
    })

    addWindow.modalCancelButton.addEventListener('click', () => {
      addWindow.modal.remove();
      document.getElementById('allselectblock');
      if (allSelectBlock) {
        allSelectBlock.innerHTML = '';
      }
      addWindow.modalAddButtonBlock.style.padding = "8px 30px";
      addWindow.modalAllSelectBlock.style.overflowY = "visible";
      addWindow.modalAllSelectBlock.style.height = "auto";
    })

    const addButton = addWindow.modalAddButton.addEventListener('click', () => {
      const createSelect = createSelectFunc();

      addWindow.modalAllSelectBlock.append(createSelect.modalSelectBlock)

      createSelect.modalSelectBlock.style.display = "flex";
      addWindow.modalAddButtonBlock.style.padding = "25px 30px";

      createSelect.modalSelectCancelButton.addEventListener('click', () => {
        createSelect.modalSelectBlock.remove()

        if (document.getElementById('selectblock')) {
          addWindow.modalAddButtonBlock.style.padding = "25px 30px";
          addWindow.modalAllSelectBlock.style.marginBottom = "25px";
        } else {
          console.log(true);
          addWindow.modalAddButtonBlock.style.padding = "8px 30px";
          addWindow.modalAllSelectBlock.style.marginBottom = "0px";
        }

        if (document.getElementsByClassName('modal__selectblock').length > 3) {
          addWindow.modalAllSelectBlock.style.overflowY = "scroll";
          addWindow.modalAllSelectBlock.style.height = "210px";
        } else {
          addWindow.modalAllSelectBlock.style.overflowY = "visible";
          addWindow.modalAllSelectBlock.style.height = "auto";
        }

        if (document.getElementsByClassName('modal__selectblock').length < 10) {
          document.querySelector(".modal__addbutton").style.display = "block";
        }
      })

      createSelect.modalSelectCancelButton.addEventListener('mouseenter', () => {
        createTip = createToolTip(createSelect.modalSelectCancelButton, "кнопка")
        createTip.tooltipText.style.display = 'block';
      })

      if (document.getElementsByClassName('modal__selectblock').length > 9) {
        document.querySelector(".modal__addbutton").style.display = "none";
      }

      let open = false;

      createSelect.modalSelect.addEventListener('click', () => {
        open = !open;
        createSelect.modalSelect.addEventListener('blur', () => {
          if (open) {
            open = !open;
            isOpen(open);
          } else {
            isOpen(open);
          }
        })
        isOpen(open)
      })

      function isOpen(open) {
        if (open) {
          createSelect.modalSelect.style.backgroundImage = "url('../frontend/images/selectOpenedVector.svg')";
        } else {
          createSelect.modalSelect.style.backgroundImage = "url('../frontend/images/selectClosedVector.svg')";
        }
      }

      if (document.getElementsByClassName('modal__selectblock').length > 3) {
        addWindow.modalAllSelectBlock.style.overflowY = "scroll";
        addWindow.modalAllSelectBlock.style.height = "210px";
      } else {
        addWindow.modalAllSelectBlock.style.overflowY = "visible";
        addWindow.modalAllSelectBlock.style.height = "auto";
      }

      let select = createSelect.modalSelect;
      let input = createSelect.modalSelectInput;

      return {
        select,
        input
      }
    })

    document.querySelector('.modal__back').addEventListener('click', () => {
      addWindow.modal.remove();
      document.getElementById('allselectblock');
      if (allSelectBlock) {
        allSelectBlock.innerHTML = '';
      }
      addWindow.modalAddButtonBlock.style.padding = "8px 30px";
      addWindow.modalAllSelectBlock.style.overflowY = "visible";
      addWindow.modalAllSelectBlock.style.height = "auto";
    })

    let form = document.getElementById('createForm');

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      let name = addWindow.modalInput1.value;
      let surname = addWindow.modalInput2.value;
      let lastname = addWindow.modalInput3.value;
      let selectValue = document.getElementsByClassName('modal__select');
      let selectInputValue = document.getElementsByClassName('modal__selectinput');

      let value1 = name[0].toUpperCase() + name.slice(1).toLowerCase();
      let value2 = surname[0].toUpperCase() + surname.slice(1).toLowerCase();
      let value3 = lastname[0].toUpperCase() + lastname.slice(1).toLowerCase();

      if (!validateTextInput(value1)) {
        addWindow.modalInput1.classList.add('modal__input-red')
        return;
      }

      if (!validateTextInput(value2)) {
        addWindow.modalInput2.classList.add('modal__input-red')
        return;
      }

      if (!validateTextInput(value3)) {
        addWindow.modalInput3.classList.add('modal__input-red')
        return;
      }

      for (let i = 0; i < selectInputValue.length; i++) {
        if (selectInputValue[i].value.trim() === '') {
          alert('Заполните контакты');
          return
        }
        switch (selectValue[i].value) {
          case "Телефон":
            if (!validatePhone(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Email":
            if (!validateEmail(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Vk":
            if (!validateURL(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Facebook":
            if (!validateEmail(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Другое":
            if (selectInputValue[i].value === '') {
              return;
            }
            break;
          default:
            break;
        }
      }

      let contactAr = [];

      for (let i = 0; i < selectValue.length; i++) {
        contactAr.push({
          type: selectValue[i].value,
          value: selectInputValue[i].value
        });
      }

      let newClient = {
        name: value1,
        surname: value2,
        lastName: value3,
        contacts: contactAr
      }

      const response = await fetch(`http://localhost:3000/api/clients`, {
        method: 'POST',
        body: JSON.stringify(newClient),
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        console.log("Клиент записан в базу данных");
        form.reset();
      } else {
        console.error('Ошибка при отправке данных на сервер:', response.statusText);
      }

      addWindow.modal.remove();
      const data = await response.json();
      clientsList.push(data);
      renderClientsTable(clientsList);
    })
  });

  async function loadClients() {
    const response = await fetch(`http://localhost:3000/api/clients`);
    const data = await response.json();
    data.forEach(client => {
      clientsList.push(client);
    })
    renderClientsTable(clientsList)
  }

  loadClients();

  function deleteCli(id) {
    const deleteWindow = createModalWindow([], "delete");
    body.append(deleteWindow.modalDelete);
    deleteWindow.deleteXButton.addEventListener('click', () => {
      deleteWindow.modalDelete.remove();
    })

    deleteWindow.deleteCancelButton.addEventListener('click', () => {
      deleteWindow.modalDelete.remove();
    })

    document.querySelector('.modal__back').addEventListener('click', () => {
      deleteWindow.modalDelete.remove();
    })

    deleteWindow.deleteButton.addEventListener('click', async () => {
      const URL = `http://localhost:3000/api/clients/${id}`;
      const response = await fetch(URL, {
        method: 'DELETE'
      })
      if (response.status === 404) {
        console.log("Не удалось найти студента");
        return;
      } else if (!response.ok) {
        console.log("Произошла ошибка при удалении студента");
        return;
      }
      for (let i = 0; i < clientsList.length; i++) {
        if (clientsList[i].id === id) {
          clientsList.splice(i, 1);
          renderClientsTable(clientsList);
          break;
        }
      }
      deleteWindow.modalDelete.remove();
    })
  }

  function editCli(obj) {
    const editWindow = createModalWindow(obj, "edit");
    console.log(editWindow.editAllSelectBlock.childElementCount);
    if (editWindow.editAllSelectBlock.childElementCount > 9) {
      editWindow.editAddButton.style.display = "none";
    }

    body.append(editWindow.edit);

    if (document.getElementById('selectblock')) {
      editWindow.editAddButtonBlock.style.padding = "25px 30px";
      editWindow.editAllSelectBlock.style.marginBottom = "25px"
    } else {
      editWindow.editAddButtonBlock.style.padding = "8px 30px";
      editWindow.editAllSelectBlock.style.marginBottom = "0"
    }

    editWindow.editXbutton.addEventListener('click', () => {
      editWindow.edit.remove();
      const allSelectBlock = document.getElementById('allselectblock');
      if (allSelectBlock) {
        allSelectBlock.innerHTML = '';
      }
      editWindow.editAddButtonBlock.style.padding = "8px 30px";
      editWindow.editAllSelectBlock.style.overflowY = "visible";
      editWindow.editAllSelectBlock.style.height = "auto";
    })

    document.querySelector('.modal__back').addEventListener('click', () => {
      editWindow.edit.remove();
      const allSelectBlock = document.getElementById('allselectblock');
      if (allSelectBlock) {
        allSelectBlock.innerHTML = '';
      }
      editWindow.editAddButtonBlock.style.padding = "8px 30px";
      editWindow.editAllSelectBlock.style.overflowY = "visible";
      editWindow.editAllSelectBlock.style.height = "auto";
    })

    editWindow.editDeleteButton.addEventListener('click', () => {
      const deleteWindow = createModalWindow([], "delete");
      body.append(deleteWindow.modalDelete);

      deleteWindow.deleteXButton.addEventListener('click', () => {
        deleteWindow.modalDelete.remove();
      })

      deleteWindow.deleteCancelButton.addEventListener('click', () => {
        deleteWindow.modalDelete.remove();
      })

      deleteWindow.deleteButton.addEventListener('click', async () => {
        const URL = `http://localhost:3000/api/clients/${obj.id}`;
        const response = await fetch(URL, {
          method: 'DELETE'
        })
        if (response.status === 404) {
          console.log("Не удалось найти студента");
          return;
        } else if (!response.ok) {
          console.log("Произошла ошибка при удалении студента");
          return;
        }
        for (let i = 0; i < clientsList.length; i++) {
          if (clientsList[i].id === obj.id) {
            clientsList.splice(i, 1);
            renderClientsTable(clientsList);
            break;
          }
        }
        deleteWindow.modalDelete.remove();
        editWindow.edit.remove();
      })
    })

    if (document.getElementsByClassName('modal__selectblock').length > 3) {
      editWindow.editAllSelectBlock.style.overflowY = "scroll";
      editWindow.editAllSelectBlock.style.height = "210px";
    } else {
      editWindow.editAllSelectBlock.style.overflowY = "visible";
      editWindow.editAllSelectBlock.style.height = "auto";
    }

    const addButton = editWindow.editAddButton.addEventListener('click', () => {
      const createSelect = createSelectFunc();
      editWindow.editAllSelectBlock.append(createSelect.modalSelectBlock)

      createSelect.modalSelectBlock.style.display = "flex";
      editWindow.editAddButtonBlock.style.padding = "25px 30px";

      createSelect.modalSelectCancelButton.addEventListener('click', () => {
        createSelect.modalSelectBlock.remove()

        if (document.getElementById('selectblock')) {
          editWindow.editAddButtonBlock.style.padding = "25px 30px";
          editWindow.editAllSelectBlock.style.marginBottom = "25px"
        } else {
          editWindow.editAddButtonBlock.style.padding = "8px 30px";
          editWindow.editAllSelectBlock.style.marginBottom = "0"
        }

        if (document.getElementsByClassName('modal__selectblock').length > 3) {
          editWindow.editAllSelectBlock.style.overflowY = "scroll";
          editWindow.editAllSelectBlock.style.height = "210px";
        } else {
          editWindow.editAllSelectBlock.style.overflowY = "visible";
          editWindow.editAllSelectBlock.style.height = "auto";
        }

        if (document.getElementsByClassName('modal__selectblock').length < 10) {
          document.querySelector(".modal__addbutton").style.display = "block";
        }
      })

      createSelect.modalSelectCancelButton.addEventListener('mouseenter', () => {
        createTip = createToolTip(createSelect.modalSelectCancelButton, "кнопка")
        createTip.tooltipText.style.display = 'block';
      })

      if (document.getElementsByClassName('modal__selectblock').length > 9) {
        document.querySelector(".modal__addbutton").style.display = "none";
      }

      let open = false;

      createSelect.modalSelect.addEventListener('click', () => {
        open = !open;
        createSelect.modalSelect.addEventListener('blur', () => {
          if (open) {
            open = !open;
            isOpen(open);
          } else {
            isOpen(open);
          }
        })
        isOpen(open)
      })

      function isOpen(open) {
        if (open) {
          createSelect.modalSelect.style.backgroundImage = "url('../frontend/images/selectOpenedVector.svg')";
        } else {
          createSelect.modalSelect.style.backgroundImage = "url('../frontend/images/selectClosedVector.svg')";
        }
      }

      if (document.getElementsByClassName('modal__selectblock').length > 3) {
        editWindow.editAllSelectBlock.style.overflowY = "scroll";
        editWindow.editAllSelectBlock.style.height = "210px";
      } else {
        editWindow.editAllSelectBlock.style.overflowY = "visible";
        editWindow.editAllSelectBlock.style.height = "auto";
      }

      let select = createSelect.modalSelect;
      let input = createSelect.modalSelectInput;

      return {
        select,
        input
      }
    })

    let form = document.getElementById('createForm');

    form.addEventListener('submit', async e => {

      e.preventDefault();
      let name = editWindow.editInput1.value;
      let surname = editWindow.editInput2.value;
      let lastname = editWindow.editInput3.value;
      let selectValue = document.getElementsByClassName('modal__select');
      let selectInputValue = document.getElementsByClassName('modal__selectinput');

      let value1 = name[0].toUpperCase() + name.slice(1).toLowerCase();
      let value2 = surname[0].toUpperCase() + surname.slice(1).toLowerCase();
      let value3 = lastname[0].toUpperCase() + lastname.slice(1).toLowerCase();

      if (!validateTextInput(value1)) {
        editWindow.editInput1.classList.add('modal__input-red')
        return;
      }

      if (!validateTextInput(value2)) {
        editWindow.editInput2.classList.add('modal__input-red')
        return;
      }

      if (!validateTextInput(value3)) {
        editWindow.editInput3.classList.add('modal__input-red')
        return;
      }

      for (let i = 0; i < selectInputValue.length; i++) {
        if (selectInputValue[i].value.trim() === '') {
          alert('Заполните контакты');
          return
        }
        switch (selectValue[i].value) {
          case "Телефон":
            if (!validatePhone(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Email":
            if (!validateEmail(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Vk":
            if (!validateURL(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Facebook":
            if (!validateEmail(selectInputValue[i].value)) {
              return;
            }
            break;
          case "Другое":
            if (selectInputValue[i].value === '') {
              return;
            }
            break;
          default:
            break;
        }
      }

      let contactAr = [];

      for (let i = 0; i < selectValue.length; i++) {
        contactAr.push({
          type: selectValue[i].value,
          value: selectInputValue[i].value
        });
      }

      let newClient = {
        name: value1,
        surname: value2,
        lastName: value3,
        contacts: contactAr
      }

      const response = await fetch(`http://localhost:3000/api/clients/${obj.id}`, {
        method: 'PATCH',
        body: JSON.stringify(newClient),
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        console.log("Информация отредактирована")
        form.reset();
      } else {
        console.error('Ошибка при отправке данных на сервер:', response.statusText);
      }
      const data = await response.json();
      for (let i = 0; i < clientsList.length; i++) {
        if (clientsList[i].id === obj.id) {
          clientsList.splice(i, 1);
          clientsList.push(data);
          renderClientsTable(clientsList);
          break;
        }
      }
      editWindow.edit.remove();
    })
  }

  const ths = document.getElementsByTagName('th');
  let dir1 = true;
  let dir2 = true;
  let dir3 = true;
  let dir4 = true;

  ths[0].addEventListener('click', function () {
    dir1 = !dir1
    sortStudents(clientsList, 'id', dir1)
    if (dir1) {
      ths[0].innerHTML = 'ID <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7" clip-path="url(#clip0_221_919)"><path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill="#9873FF"/></g><defs><clipPath id="clip0_221_919"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>';
    } else {
      ths[0].innerHTML = 'ID <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
    }
  })

  ths[1].addEventListener('click', function () {
    dir2 = !dir2
    sortStudents(clientsList, 'name', dir2)
    if (dir2) {
      ths[1].innerHTML = 'Фамилия Имя Отчество <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7" clip-path="url(#clip0_221_919)"><path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill="#9873FF"/></g><defs><clipPath id="clip0_221_919"><rect width="12" height="12" fill="white"/></clipPath></defs></svg><span class="clients__span-purple">А-Я</span>';
    } else {
      ths[1].innerHTML = 'Фамилия Имя Отчество <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg><span class="clients__span-purple">А-Я</span>';
    }
  })

  ths[2].addEventListener('click', function () {
    dir3 = !dir3
    sortStudents(clientsList, 'createdAt', dir3)
    if (dir3) {
      ths[2].innerHTML = 'Дата и время создания <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7" clip-path="url(#clip0_221_919)"><path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill="#9873FF"/></g><defs><clipPath id="clip0_221_919"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>';
    } else {
      ths[2].innerHTML = 'Дата и время создания <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
    }
  })

  ths[3].addEventListener('click', function () {
    dir4 = !dir4
    sortStudents(clientsList, 'updatedAt', dir4)
    if (dir4) {
      ths[3].innerHTML = 'Последние изменения <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7" clip-path="url(#clip0_221_919)"><path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill="#9873FF"/></g><defs><clipPath id="clip0_221_919"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>';
    } else {
      ths[3].innerHTML = 'Последние изменения <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
    }
  })

  function sortStudents(clientsArray, prop, dir = false) {
    let result = clientsArray.sort(function(a, b) {
      if(!dir ? a[prop] < b[prop] : a[prop] > b[prop]) return -1;
      return 0;
    });
    renderClientsTable(result);
  }

  var delay = 0;
  var delayTimeout;

  function filter(secs) {
    delay = secs*1000;
    clearTimeout(delayTimeout);
    delayTimeout = setTimeout(filterClients, delay);
  }

  function filterClients() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredClients = clientsList.filter(client => {
      return client.name.toLowerCase().includes(query) ||
             client.surname.toLowerCase().includes(query) ||
             client.lastName.toLowerCase().includes(query) ||
             client.id.includes(query) ||
             toStringDate(new Date(client.createdAt)).includes(query) ||
             toStringDate(new Date(client.updatedAt)).includes(query) ||
             (new Date(client.updatedAt).getHours() + ":" + (new Date(client.updatedAt).getMinutes() < 10 ? '0' : '') + new Date(client.updatedAt).getMinutes()).includes(query) ||
             (new Date(client.createdAt).getHours() + ":" + (new Date(client.createdAt).getMinutes() < 10 ? '0' : '') + new Date(client.createdAt).getMinutes()).includes(query)
             //client.contacts.forEach(contact => {contact.value.toLowerCase().includes(query)})
    });
    renderClientsTable(filteredClients);
  }

  function validateTextInput(input) {
    if (!input.trim()) {
      alert("Поле не должно быть пустым");
      return false;
    }
    if (!/^[а-яА-ЯёЁa-zA-Z\s]+$/.test(input)) {
      alert("Поле должно содержать только буквы");
      return false;
    }
    return true;
  }

  function validatePhone(phone) {
    const phoneRegex = /^(\+7|8)\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Номер телефона должен соответствовать формату +7XXXXXXXXXX или 8XXXXXXXXXX");
      return false;
    }
    return true;
  }

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      alert("Email должен быть валидным");
      return false;
    }
    return true;
  }

  function validateURL(url) {
    const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+(\.[a-zA-Z]{2,}){1,2}(\/[a-zA-Z0-9#]+\/?)*$/;
    if (!urlRegex.test(url)) {
      alert("Введите корректный URL");
      return false;
    }
    return true;
  }

  function createBodyFunc() {
    const body = document.body;
    const header = createHeader();
    const main = createMain();
    const headerSearch = header.headerInput;
    const mainButton = main.clientsButton;
    const tbody = main.clientsTbody;
    body.append(header.header);
    body.append(main.main);
    headerSearch.addEventListener('input', () => filter(0.3));
    return {
      body,
      headerSearch,
      mainButton,
      tbody
    }
  }

  function createHeader() {
    const header = document.createElement('header');
    const headerContainer = document.createElement('div');
    const headerBlock = document.createElement('div');
    const headerLogo = document.createElement('a');
    const headerPicture = document.createElement('picture');
    const headerSource = document.createElement('source');
    const headerLogoImg = document.createElement('img');
    const headerInput = document.createElement('input');

    header.classList.add('header');
    headerContainer.classList.add('header__container', 'container');
    headerBlock.classList.add('header__block', 'flex');
    headerLogo.classList.add('header__logo');
    headerPicture.classList.add('header__picture');
    headerLogoImg.classList.add('header__img', 'img')
    headerInput.classList.add('header__input', 'input')
    headerInput.id = "search";
    headerLogo.href = '#';
    headerSource.srcset = '../frontend/images/Logo.svg';
    headerSource.type = 'image/svg+xml';
    headerSource.media = '(min-width: 577px)';
    headerLogoImg.src = '../frontend/images/mini-logo.svg'
    headerLogoImg.alt = "Логотип Skillbus"
    headerInput.type = 'text';
    headerInput.placeholder = 'Введите запрос'

    headerPicture.append(headerSource, headerLogoImg);
    headerLogo.append(headerPicture);
    headerBlock.append(headerLogo, headerInput);
    headerContainer.append(headerBlock);
    header.append(headerContainer);


    return {
      header,
      headerInput
    };
  }

  function createMain() {
    const main = document.createElement('main');
    const clientsSection = document.createElement('section');
    const clientsContainer = document.createElement('div');
    const clientsBlock = document.createElement('div');
    const clientsTitle = document.createElement('h2');
    const clientsTable = document.createElement('table');
    const clientsThead = document.createElement('thead');
    const clientsTr = document.createElement('tr');
    const clientsTh = document.createElement('th');
    const clientsTh1 = document.createElement('th');
    const clientsTh2 = document.createElement('th');
    const clientsTh3 = document.createElement('th');
    const clientsTh4 = document.createElement('th');
    const clientsTh5 = document.createElement('th');
    const clientsTbody = document.createElement('tbody');
    const clientsButton = document.createElement('button');

    main.classList.add('main');
    clientsSection.classList.add('section');
    clientsContainer.classList.add('clients__container', 'container');
    clientsBlock.classList.add('clients__block');
    clientsTitle.classList.add('clients__title');
    clientsTable.classList.add('clients__table');
    clientsTable.id = "myTable";
    clientsThead.classList.add('clients__thead');
    clientsTr.classList.add('clients__tr');
    clientsTh.classList.add('clients__th', 'clients__th-purple');
    clientsTh.id = "id";
    clientsTh1.classList.add('clients__th');
    clientsTh1.id = "fio";
    clientsTh2.classList.add('clients__th');
    clientsTh2.id = "dateAdded";
    clientsTh3.classList.add('clients__th');
    clientsTh3.id = "dateChanged";
    clientsTh4.classList.add('clients__th');
    clientsTh5.classList.add('clients__th');
    clientsTbody.classList.add('clients__tbody');
    clientsTbody.id = "tbody";
    clientsButton.classList.add('clients__btn', 'btn')

    clientsTitle.textContent = "Клиенты";
    clientsTh.innerHTML = 'ID <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
    clientsTh1.innerHTML = 'Фамилия Имя Отчество <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg><span class="clients__span-purple">А-Я</span>';
    clientsTh2.innerHTML = 'Дата и время создания <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>'
    clientsTh3.innerHTML = 'Последние изменения <svg class="clients__svg1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>'
    clientsTh4.textContent = 'Контакты';
    clientsTh5.textContent = 'Действия';
    clientsButton.innerHTML = '<svg class="clients__svg"  width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z" fill=""/></svg> Добавить клиента'

    clientsTr.append(clientsTh, clientsTh1, clientsTh2, clientsTh3, clientsTh4, clientsTh5);
    clientsThead.append(clientsTr);
    clientsTable.append(clientsThead, clientsTbody);
    clientsBlock.append(clientsTitle, clientsTable, clientsButton);
    clientsContainer.append(clientsBlock);
    clientsSection.append(clientsContainer);
    main.append(clientsSection);

    return {
      main,
      clientsButton,
      clientsTbody
    };
  }

  function createModalWindow(obj, string) {
    switch (string) {
      case "add":
        const modal = document.createElement('div');
        const modalBackground = document.createElement('a');
        const modalWindow = document.createElement('div');
        const modalTitleBlock = document.createElement('div');
        const modalTitle = document.createElement('h3');
        const modalForm = document.createElement('form');
        const modalFormBlock = document.createElement('div');
        const modalInput1 = document.createElement('input');
        const modalInput2 = document.createElement('input');
        const modalInput3 = document.createElement('input');
        const modalAddButtonBlock = document.createElement('div');
        const modalAllSelectBlock = document.createElement('div');
        const modalAddButton = document.createElement('button');
        const modalSaveButton = document.createElement('button');
        const modalXbuttonBlock = document.createElement('div');
        const modalXbutton = document.createElement('button');
        const modalCancelButton = document.createElement('button');

        modal.classList.add('modal__position');
        modalBackground.classList.add('modal__back')
        modalWindow.classList.add('modal');
        modalXbutton.classList.add('modal__xbutton');
        modalTitleBlock.classList.add('modal__titleblock');
        modalTitle.classList.add('modal__title');
        modalForm.classList.add('modal__form');
        modalForm.id = 'createForm';
        modalFormBlock.classList.add('modal__formblock', 'flex');
        modalInput1.classList.add('modal__input', 'input');
        modalInput2.classList.add('modal__input', 'input');
        modalInput3.classList.add('modal__input', 'input');
        modalAddButtonBlock.classList.add('modal__addbuttonblock');
        modalAllSelectBlock.classList.add('modal__allselect');
        modalAddButton.classList.add('modal__addbutton', 'btn');
        modalSaveButton.classList.add('modal__savebutton', 'btn');
        modalCancelButton.classList.add('modal__cancelbutton', 'btn');
        modalXbuttonBlock.classList.add('modal__xbuttonblock');
        modalXbutton.classList.add('modal__xbutton', 'btn');

        modalTitle.textContent = "Новый клиент";
        modalInput1.placeholder = "Фамилия";
        modalInput1.type = "text";
        modalInput2.placeholder = "Имя";
        modalInput2.type = "text";
        modalInput3.placeholder = "Отчество";
        modalInput3.type = "text";
        modalAddButton.innerHTML = '<svg class="modal__addsvg" viewBox="0 0 160 160" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><circle class="modal__svgcircle" r="60" cx="80" cy="80" fill="transparent" stroke="#9873FF" stroke-width="13.5px"></circle><g class="modal__svgg" fill="#9873FF"><rect width="13.5" height="66.5" x="73.3" y="46.6" rx="7"></rect><rect width="13.5" height="66.5" x="73.3" y="46.6" rx="7" transform = "rotate(90 80 80)"></rect></g></svg> Добавить контакт'
        modalAddButton.type = "button";
        modalAllSelectBlock.id = "allselectblock";
        modalSaveButton.textContent = "Сохранить";
        modalSaveButton.type = "submit";
        modalCancelButton.textContent = "Отмена";

        modalTitleBlock.append(modalTitle);
        modalAddButtonBlock.append(modalAllSelectBlock, modalAddButton);
        modalXbuttonBlock.append(modalXbutton);
        modalFormBlock.append(modalInput1, modalInput2, modalInput3);
        modalForm.append(modalFormBlock, modalAddButtonBlock, modalSaveButton);
        modalWindow.append(modalTitleBlock, modalXbuttonBlock, modalForm, modalCancelButton);
        modal.append(modalBackground, modalWindow);

        return {
          modal,
          modalInput1,
          modalInput2,
          modalInput3,
          modalAllSelectBlock,
          modalAddButtonBlock,
          modalAddButton,
          modalXbutton,
          modalSaveButton,
          modalCancelButton,
        };
      case "delete":
        const modalDelete = document.createElement('div');
        const deleteWin = document.createElement('div');
        const deleteBackground = document.createElement('a');
        const deleteblock = document.createElement('div');
        const deleteTitle = document.createElement('h3');
        const deleteText = document.createElement('p');
        const deleteButton = document.createElement('button');
        const deleteCancelButton = document.createElement('button');
        const deleteXButtonBlock = document.createElement('div');
        const deleteXButton = document.createElement('button');

        modalDelete.classList.add('modal__position');
        deleteWin.classList.add('delete');
        deleteBackground.classList.add('modal__back');
        deleteblock.classList.add('delete__block');
        deleteTitle.classList.add('delete__title');
        deleteText.classList.add('delete__text')
        deleteXButtonBlock.classList.add('modal__xbuttonblock');
        deleteXButton.classList.add('modal__xbutton', 'btn');
        deleteButton.classList.add('modal__savebutton', 'btn');
        deleteCancelButton.classList.add('modal__cancelbutton', 'btn');

        deleteTitle.textContent = "Удалить клиента";
        deleteText.textContent = "Вы действительно хотите удалить данного клиента?";
        deleteButton.textContent = "Удалить";
        deleteCancelButton.textContent = "Отмена";

        deleteXButtonBlock.append(deleteXButton);
        deleteblock.append(deleteXButtonBlock, deleteCancelButton, deleteButton, deleteText, deleteTitle);
        deleteWin.append(deleteblock);
        modalDelete.append(deleteBackground, deleteWin);

        return {
          modalDelete,
          deleteButton,
          deleteCancelButton,
          deleteXButton
        }
      case "edit":
        const edit = document.createElement('div');
        const editBack = document.createElement('a');
        const editWindow = document.createElement('div');
        const editTitleBlock = document.createElement('div');
        const editTitle = document.createElement('h3');
        const editId = document.createElement('span');
        const editForm = document.createElement('form');
        const editFormBlock = document.createElement('div');
        const editInput1 = document.createElement('input');
        const editInput2 = document.createElement('input');
        const editInput3 = document.createElement('input');
        const editAddButtonBlock = document.createElement('div');
        const editAllSelectBlock = document.createElement('div');
        const editAddButton = document.createElement('button');
        const editSaveButton = document.createElement('button');
        const editXbuttonBlock = document.createElement('div');
        const editXbutton = document.createElement('button');
        const editDeleteButton = document.createElement('button');

        edit.classList.add('modal__position');
        editBack.classList.add('modal__back');
        editWindow.classList.add('modal');
        editXbutton.classList.add('modal__xbutton');
        editTitleBlock.classList.add('edit__titleblock', 'modal__titleblock');
        editTitle.classList.add('modal__title');
        editId.classList.add('edit__span');
        editForm.classList.add('modal__form');
        editForm.id = 'createForm';
        editFormBlock.classList.add('modal__formblock', 'flex');
        editInput1.classList.add('modal__input', 'input');
        editInput2.classList.add('modal__input', 'input');
        editInput3.classList.add('modal__input', 'input');
        editAddButtonBlock.classList.add('modal__addbuttonblock');
        editAllSelectBlock.classList.add('modal__allselect');
        editAddButton.classList.add('modal__addbutton', 'btn');
        editSaveButton.classList.add('modal__savebutton', 'btn');
        editDeleteButton.classList.add('modal__cancelbutton', 'btn');
        editXbuttonBlock.classList.add('modal__xbuttonblock');
        editXbutton.classList.add('modal__xbutton', 'btn');

        editTitle.textContent = "Изменить данные";
        editId.textContent = "ID: " + obj.id;
        editInput1.placeholder = "Фамилия";
        editInput1.type = "text";
        editInput2.placeholder = "Имя";
        editInput2.type = "text";
        editInput3.placeholder = "Отчество";
        editInput3.type = "text";
        editInput1.value = obj.name;
        editInput2.value = obj.surname;
        editInput3.value = obj.lastName;
        for (let i = 0; i < obj.contacts.length; i++) {
          const createSelects = createSelectFunc();
          createSelects.modalSelectBlock.style.display = "flex";

          createSelects.modalSelectCancelButton.addEventListener('click', () => {
            createSelects.modalSelectBlock.remove()

            if (document.getElementById('selectblock')) {
              editAddButtonBlock.style.padding = "25px 30px";
              editAllSelectBlock.style.marginBottom = "25px"
            } else {
              editAddButtonBlock.style.padding = "8px 30px";
              editAllSelectBlock.style.marginBottom = "0"
            }

            if (document.getElementsByClassName('modal__selectblock').length > 3) {
              editAllSelectBlock.style.overflowY = "scroll";
              editAllSelectBlock.style.height = "210px";
            } else {
              editAllSelectBlock.style.overflowY = "visible";
              editAllSelectBlock.style.height = "auto";
            }
          })

          createSelects.modalSelectCancelButton.addEventListener('mouseenter', () => {
            createTip = createToolTip(createSelects.modalSelectCancelButton, "кнопка")
            createTip.tooltipText.style.display = 'block';
          })

          let open = false;

          createSelects.modalSelect.addEventListener('click', () => {
            open = !open;
            createSelects.modalSelect.addEventListener('blur', () => {
              if (open) {
                open = !open;
                isOpen(open);
              } else {
                isOpen(open);
              }
            })
            isOpen(open)
          })

          function isOpen(open) {
            if (open) {
              createSelects.modalSelect.style.backgroundImage = "url('../frontend/images/selectOpenedVector.svg')";
            } else {
              createSelects.modalSelect.style.backgroundImage = "url('../frontend/images/selectClosedVector.svg')";
            }
          }

          if (document.getElementsByClassName('modal__selectblock').length > 3) {
            editAllSelectBlock.style.overflowY = "scroll";
            editAllSelectBlock.style.height = "210px";
          } else {
            editAllSelectBlock.style.overflowY = "visible";
            editAllSelectBlock.style.height = "auto";
          }

          createSelects.modalSelect.value = obj.contacts[i].type;
          createSelects.modalSelectInput.value = obj.contacts[i].value;

          editAllSelectBlock.append(createSelects.modalSelectBlock)

          // let select = createSelect.modalSelect;
          // let input = createSelect.modalSelectInput;

          // return {
          //   select,
          //   input
          // }
        }


        editAddButton.innerHTML = '<svg class="modal__addsvg" viewBox="0 0 160 160" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><circle class="modal__svgcircle" r="60" cx="80" cy="80" fill="transparent" stroke="#9873FF" stroke-width="13.5px"></circle><g class="modal__svgg" fill="#9873FF"><rect width="13.5" height="66.5" x="73.3" y="46.6" rx="7"></rect><rect width="13.5" height="66.5" x="73.3" y="46.6" rx="7" transform = "rotate(90 80 80)"></rect></g></svg> Добавить контакт'
        editAddButton.type = "button";
        editAllSelectBlock.id = "allselectblock";
        editSaveButton.textContent = "Сохранить";
        editSaveButton.type = "submit";
        editDeleteButton.textContent = "Удалить клиента";

        editTitleBlock.append(editTitle, editId);
        editAddButtonBlock.append(editAllSelectBlock, editAddButton);
        editXbuttonBlock.append(editXbutton);
        editFormBlock.append(editInput1, editInput2, editInput3);
        editForm.append(editFormBlock, editAddButtonBlock, editSaveButton)
        editWindow.append(editTitleBlock, editXbuttonBlock, editForm, editDeleteButton);
        edit.append(editBack, editWindow);

        return {
          edit,
          editInput1,
          editInput2,
          editInput3,
          editAllSelectBlock,
          editAddButtonBlock,
          editAddButton,
          editXbutton,
          editSaveButton,
          editDeleteButton,
        };
        break;
      default:
        break;
    }
  }

  function createSelectFunc() {
    const modalSelectBlock = document.createElement('div');
    const modalSelect = document.createElement('select');
    const modalOption1 = document.createElement('option');
    const modalOption2 = document.createElement('option');
    const modalOption3 = document.createElement('option');
    const modalOption4 = document.createElement('option');
    const modalOption5 = document.createElement('option');
    const modalSelectInput = document.createElement('input');
    const modalSelectCancelButton = document.createElement('button');

    modalSelectBlock.style.display = "none";
    modalSelect.name = "contacts";
    modalOption1.value = "Телефон";
    modalOption1.innerHTML = "Телефон";
    modalOption2.value = "Email";
    modalOption2.innerHTML = "Email";
    modalOption3.value = "Vk";
    modalOption3.innerHTML = "Vk";
    modalOption4.value = "Facebook";
    modalOption4.innerHTML = "Facebook";
    modalOption5.value = "Другое";
    modalOption5.innerHTML = "Другое"

    modalSelectInput.placeholder = "Введите данные контакта";
    modalSelectCancelButton.innerHTML = '<svg class="modal__selectsvg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_121_1083)"><path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/></g><defs><clipPath id="clip0_121_1083"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>'
    modalSelectCancelButton.type = "button";
    modalSelect.style.backgroundImage = "url('../frontend/images/selectClosedVector.svg')";

    modalSelectBlock.classList.add('modal__selectblock');
    modalSelectBlock.id = "selectblock";
    modalSelect.classList.add('modal__select', 'input', 'closed');
    modalSelectInput.classList.add('modal__selectinput', 'input');
    modalSelectCancelButton.classList.add('modal__selectbtn', 'btn');

    modalSelect.append(modalOption1, modalOption2, modalOption3, modalOption4, modalOption5);
    modalSelectBlock.append(modalSelect, modalSelectInput, modalSelectCancelButton);

    return {
      modalSelectBlock,
      modalSelect,
      modalSelectInput,
      modalSelectCancelButton
    }
  }

  function toStringDate(date) {
    return date.toLocaleDateString();
  }

  function createToolTip(element, contact, string) {

    if (string === "контакт") {
      const tooltip = document.createElement('div');
      const tooltipText = document.createElement('p');
      const tooltipLink = document.createElement('a');

      tooltip.classList.add('tooltip-container');
      tooltipText.classList.add('tooltip-text');
      tooltipLink.classList.add('tooltip__link');
      switch (contact.type) {
        case "Телефон":
          tooltipLink.href = "tel:" + contact.value;
          break;
        case "Email":
          tooltipLink.href = "mailto:" + contact.value;
          break;
        case "Vk":
          tooltipLink.href = contact.value;
          break;
        case "Facebook":
          tooltipLink.href = contact.value;
          break;
        case "Другое":
          tooltipLink.href = contact.value;
          break;
        default:
          break;
      }
      tooltipLink.textContent = contact.value;
      tooltipText.textContent = contact.type + ': ';
      element.addEventListener('mouseleave', () => {
        tooltipText.style.display = 'none';
      })
      tooltipText.append(tooltipLink);
      tooltip.append(tooltipText);
      element.append(tooltip);

      return {
        tooltip,
        tooltipText
      }
    } else {
      const tooltip = document.createElement('div');
      const tooltipText = document.createElement('p');

      tooltip.classList.add('tooltip-container');
      tooltipText.classList.add('tooltip-text');

      tooltipText.textContent = "Удалить контакт";
      element.addEventListener('mouseleave', () => {
        tooltipText.style.display = 'none';
      })

      tooltip.append(tooltipText);
      element.append(tooltip);

      return {
        tooltip,
        tooltipText
      }
    }

    return {
      tooltip,
      tooltipText
    }
  }

  function renderClientsTable(clientsArray) {
    tbody = document.getElementById('tbody')
    tbody.innerHTML = '';
    clientsArray.forEach(client => {
      getClientItem(client);
    })
  }


  function getClientItem(clientObj) {
    const tbody = document.getElementById('tbody');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const tdDate3 = document.createElement('div');
    const tdDate4 = document.createElement('div');
    const tdP3 = document.createElement('p');
    const tdP4 = document.createElement('p');
    const tdSpan3 = document.createElement('span');
    const tdSpan4 = document.createElement('span');
    const td5 = document.createElement('td');
    const ul = document.createElement('ul');
    let counter = 0;
    for (let i = 0; i < clientObj.contacts.length; i++) {
      let li = document.createElement('li');
      li.classList.add('contacts__item')
      switch (clientObj.contacts[i].type) {
        case 'Телефон':
          li.innerHTML = '<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><circle cx="8" cy="8" r="8" fill="#9873FF"/><path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/></g></svg>'
          break;
        case 'Email':
          li.innerHTML = '<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/></svg>'
          break;
        case 'Vk':
          li.innerHTML = '<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/></g></svg>'
          break;
        case 'Facebook':
          li.innerHTML = '<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/></g></svg>'
          break;
        case 'Другое':
          li.innerHTML = '<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/></svg>'
          break;
        default:
          break;
      }
      li.addEventListener('mouseenter', () => {
        createTip = createToolTip(li, clientObj.contacts[i], "контакт")
        createTip.tooltipText.style.display = 'block';
      });
      ul.append(li);
      counter++;
    }

    if (clientObj.contacts.length > 5) {
      if (ul.children.length >= 5) {
        let moreContactsLi = document.createElement('li');
        moreContactsLi.classList.add("contacts__item");
        moreContactsLi.innerHTML = `<svg class="contacts__svg-more" width="16" height="16" viewBox="0 0 16 16" fill="" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" stroke="#9873FF"/></svg><span class="contacts__svgspan">+${clientObj.contacts.length - 4}</span>`;

        for (let i = 4; i < ul.children.length; i++) {
          ul.children[i].style.display = "none";
        }

        ul.appendChild(moreContactsLi);

        moreContactsLi.addEventListener('click', () => {
          for (let i = 4; i < ul.children.length; i++) {
            ul.children[i].style.display = "block";
            moreContactsLi.style.display = "none";
          }
        });
      }
  }

    td6 = document.createElement('td');
    changeButton = document.createElement('button');
    deleteButton = document.createElement('button');
    btnBlock = document.createElement('div');

    td1.textContent = clientObj.id;
    td1.style.color = "#b0b0b0";
    td2.textContent = clientObj.name + " " + clientObj.surname + " " + clientObj.lastName;
    createdDate = new Date(clientObj.createdAt);
    updatedDate = new Date(clientObj.updatedAt);
    tdP3.textContent = toStringDate(createdDate);
    tdP4.textContent = toStringDate(updatedDate);
    tdSpan3.textContent = createdDate.getHours() + ":" + (createdDate.getMinutes() < 10 ? '0' : '') + createdDate.getMinutes();
    tdSpan4.textContent = updatedDate.getHours() + ":" + (updatedDate.getMinutes() < 10 ? '0' : '') + updatedDate.getMinutes();

    changeButton.innerHTML = '<svg class="clients__changesvg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 9.49996V12H2.5L9.87333 4.62662L7.37333 2.12662L0 9.49996ZM11.8067 2.69329C12.0667 2.43329 12.0667 2.01329 11.8067 1.75329L10.2467 0.193291C9.98667 -0.066709 9.56667 -0.066709 9.30667 0.193291L8.08667 1.41329L10.5867 3.91329L11.8067 2.69329Z" fill="#9873FF"/></svg> Изменить';
    deleteButton.innerHTML = '<svg class="clients__deletesvg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/></svg> Удалить';

    td1.classList.add('clients__td');
    td2.classList.add('clients__td');
    td3.classList.add('clients__td');
    td4.classList.add('clients__td');
    tdDate3.classList.add('clients__dateblock', 'flex');
    tdDate4.classList.add('clients__dateblock', 'flex');
    tdSpan3.classList.add('clients__datespan');
    tdSpan4.classList.add('clients__datespan');
    ul.classList.add('list-reset', 'flex', 'contacts__list');
    td5.classList.add('clients__td');
    td6.classList.add('clients__td');
    changeButton.classList.add('clients__changebtn', 'btn');
    deleteButton.classList.add('clients__deletebtn', 'btn');
    btnBlock.classList.add('flex', 'clients__btnblock');
    deleteButton.addEventListener('click', () => deleteCli(clientObj.id));
    changeButton.addEventListener('click', () => editCli(clientObj))

    tdDate3.append(tdP3, tdSpan3);
    tdDate4.append(tdP4, tdSpan4);
    td3.append(tdDate3);
    td4.append(tdDate4);
    td5.append(ul);
    btnBlock.append(changeButton, deleteButton);
    td6.append(btnBlock);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
    tr.append(td6);
    tbody.append(tr);
  }
}

startFunc();
