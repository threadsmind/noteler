let noteData = {};

(function(d) {
  const elMain = d.getElementById('__main');
  const elAdd = d.getElementById('__add');
  const elName = d.getElementById('__name');
  const elSave = d.getElementById('__save');
  const elData = d.getElementById('__data');
  const elLoad = d.getElementById('__load');

  elAdd.addEventListener('click', addTile);
  elSave.addEventListener('click', saveData);
  elLoad.addEventListener('click', loadData);

  function addTile(e) {
    e.preventDefault();
    makeNewTile(elName.value, '');
  }

  function makeNewTile(name, __text) {
    if (!name || name === '' || noteData[name] || noteData[name] === '') return;

    const tileDiv = d.createElement('div');
    const headerDiv = d.createElement('div');
    const textDiv = d.createElement('div');
    const nameSpan = d.createElement('span');
    const deleteButton = d.createElement('button');
    const smallButton = d.createElement('button');
    const textarea = d.createElement('textarea');

    smallButton.innerText = 'V';
    nameSpan.innerText = name;
    deleteButton.innerText = 'X';
    deleteButton.setAttribute('class', 'delete');

    headerDiv.appendChild(smallButton);
    headerDiv.appendChild(nameSpan);
    headerDiv.appendChild(deleteButton);

    textarea.value = __text || '';
    textarea.placeholder = 'Note text...'
    textDiv.appendChild(textarea);

    tileDiv.appendChild(headerDiv);
    tileDiv.appendChild(textDiv);
    tileDiv.setAttribute('name', name);

    elMain.appendChild(tileDiv);

    deleteButton.addEventListener('click', deleteNode.bind(this, tileDiv));
    smallButton.addEventListener('click', smallNode.bind(this, smallButton, textDiv));
    textarea.addEventListener('change', updateText.bind(this, name, textarea));

    textarea.focus();

    elName.value = '';
    noteData[name] = __text;
  }

  function deleteNode(node) {
    elMain.removeChild(node);
    delete noteData[node.getAttribute('name')];
  }

  function smallNode(button, node) {
    if (button.innerText === 'V') {
      node.style = 'display: none';
      button.innerText = '>'
    } else {
      node.style = '';
      button.innerText = 'V';
    }
  }

  function updateText(name, node) {
    noteData[name] = node.value;
  }

  function saveData() {
    elData.value = JSON.stringify(noteData);
  }

  function loadData() {
    if (!elData || elData.value === '') return;
    let tempSave;
    try {
      tempSave = JSON.parse(elData.value);
    } catch (e) {
      console.log(e);
      return;
    }
    elMain.innerHTML = null;
    noteData = {};
    const keys = Object.keys(tempSave);
    keys.forEach((key) => {
      makeNewTile(key, tempSave[key]);
    })
  }
})(document)
