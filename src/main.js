import api from './api';

class App {
  constructor() {
    this.repositories = [];

    this.formEl = document.getElementById('repo-form');
    this.inputEl = document.querySelector('input[name=repository]')
    this.listEl = document.getElementById('repo-list');

    this.registerHandlers();
  }

  registerHandlers() {
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  startLoading(loading = true) {
    if (loading) {
      let loadingEl = document.createElement('span');
      loadingEl.appendChild(document.createTextNode('Carregando'));
      loadingEl.setAttribute('id', 'loading');

      this.formEl.appendChild(loadingEl);
    } else {
      document.getElementById('loading').remove();
    }
  }

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;
    if (!repoInput) {
      return;
    }

    this.startLoading()

    try {
      const response = await api.get(`/repos/${repoInput}`);

      const { name, description, html_url, owner: { avatar_url } } = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url,
      });

      this.render();
    } catch (err) {
      alert('O repositório não existe')
    }

    this.startLoading(false);
    this.inputEl.value = '';
  }

  render() {
    this.listEl.innerHTML = '';

    this.repositories.forEach(item => {
      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', item.avatar_url);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(item.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(item.description));

      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('href', item.html_url);
      linkEl.appendChild(document.createTextNode('Acessar'));

      let listItemEl = document.createElement('li');
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEl);

      this.listEl.appendChild(listItemEl);
    })
  }
}

new App();