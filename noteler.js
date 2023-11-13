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
  elData.addEventListener('click', elData.select);

  loadData(1);

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
    const collapseButton = d.createElement('button');
    const textarea = d.createElement('textarea');

    collapseButton.innerText = 'V';
    collapseButton.ariaLabel = 'Hide note ' + name;
    nameSpan.innerText = name;
    nameSpan.className = 'note-name';
    deleteButton.innerText = 'X';
    deleteButton.ariaLabel = 'Delete note ' + name;
    headerDiv.className = 'flex';

    headerDiv.appendChild(collapseButton);
    headerDiv.appendChild(nameSpan);
    headerDiv.appendChild(deleteButton);

    textarea.value = __text || '';
    textarea.placeholder = 'Note text...';
    textarea.ariaLabel = 'note body ' + name;
    textarea.className = 'note-body';
    textDiv.appendChild(textarea);

    tileDiv.appendChild(headerDiv);
    tileDiv.appendChild(textDiv);
    tileDiv.setAttribute('name', name);

    elMain.appendChild(tileDiv);

    deleteButton.addEventListener('click', deleteNode.bind(this, tileDiv));
    collapseButton.addEventListener('click', collapseNode.bind(this, collapseButton, textDiv, name));
    textarea.addEventListener('change', updateText.bind(this, name, textarea));

    textarea.focus();

    elName.value = '';
    noteData[name] = __text;
  }

  function deleteNode(node) {
    elMain.removeChild(node);
    delete noteData[node.getAttribute('name')];
  }

  function collapseNode(button, node, name) {
    if (button.innerText === 'V') {
      node.style = 'display: none';
      button.innerText = '>'
      button.ariaLabel = 'Show note ' + name;
    } else {
      node.style = '';
      button.innerText = 'V';
      button.ariaLabel = 'Hide note ' + name;
    }
  }

  function updateText(name, node) {
    noteData[name] = node.value;
  }

  function saveData() {
    const dataString = JSON.stringify(noteData);
    elData.value = dataString;
    useLocalData('set', dataString);
  }

  function loadData(isInitLoad) {
    if (isInitLoad != 1 && (!elData || elData.value === '')) return;
    let tempSave;
    try {
      tempSave = (isInitLoad === 1) ? useLocalData('get') : JSON.parse(elData.value);
    } catch (e) {
      if (!isInitLoad) console.log(e);
      return;
    }
    elMain.innerHTML = null;
    noteData = {};
    const keys = Object.keys(tempSave);
    keys.forEach((key) => {
      makeNewTile(key, tempSave[key]);
    });
    elData.value = '';
  }

  function useLocalData(op, saveData) {
    try {
      if (op === 'set' && !!saveData) {
        localStorage.setItem('note', saveData);
        return
      }
      if (op === 'get')
        return JSON.parse(localStorage.getItem('note'));
    } catch(e) {}
    return {};
  }
})(document)
