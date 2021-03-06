function main() {
  const HyfReposHttps = "https://api.github.com/orgs/HackYourFuture/repos";

  getDataFromServer(HyfReposHttps, repositoriesCallback);
}

var repositories = [];

// Callback that handles response from server
function repositoriesCallback(data) {
  repositories = JSON.parse(data);
  console.log(
    `Received and parsed ${repositories.length} repositories from server.`
  );
  showRepositoriesInSelect(repositories);
}

function showRepositoriesInSelect(repositories) {
  const repositoriesSelectElement = document.querySelector("#repositories");

  repositoriesSelectElement.setAttribute(
    "onchange",
    "getContributors(this.value); showRepository(this.value)"
  );

  repositories.forEach(repository => {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", repository.id);
    optionElement.innerText = repository.name;

    repositoriesSelectElement.appendChild(optionElement);
  });
}

function showRepository(repositoryId) {
  const selectedRepository = repositories.filter(repository => {
    return repository.id === Number.parseInt(repositoryId);
  })[0];

  const repositoryInfo = document.querySelector('.repository-info');
  repositoryInfo.innerHTML = `<strong>Repository:</strong><span>${selectedRepository.name}</span> <br>
                                <strong>Description:</strong><span>${selectedRepository.description}</span> <br>
                                <strong>Forks:</strong><span>${selectedRepository.forks}</span> <br>
                                <strong>Updated:</strong><span>${selectedRepository.updated_at}</span>`;
}

function getContributors(repositoryId) {
  const selectedRepository = repositories.filter(repository => {
    return repository.id === Number.parseInt(repositoryId);
  })[0];

  getDataFromServer(selectedRepository.contributors_url, data => {
    showContributors(data);
  });
}

function showContributors(contributorsData) {
  const contributors = JSON.parse(contributorsData);
  const contributorsListElement = document.querySelector(".contributors-list");

  contributors.forEach(contributor => {
    const listItemElement = document.createElement("li");
    listItemElement.innerHTML = `<img width="100px" src="${contributor.avatar_url}"> <span>${contributor.login}</span> <span>${contributor.contributions}</span>`;

    contributorsListElement.appendChild(listItemElement);
  });
}

// Function that makes an server request (API call)
function getDataFromServer(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
