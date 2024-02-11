const saveOptions = async () => {
  const optDivs = document.querySelectorAll('#options > div:not(#add)');

  const opts = {};

  for (const optDiv of optDivs) {
    const regex = optDiv.firstElementChild;
    const selector = regex.nextElementSibling;
    if (!regex || !selector)
      continue;

    if (!regex.value || !selector.value)
      continue;

    opts[regex.value] = selector.value.split(/\r?\n/g);
  }

  await chrome.storage.sync.set({ matchPatterns: opts });
};

const restoreOptions = async () => {
  const { matchPatterns: matches } = await chrome.storage.sync.get({ matchPatterns: {} });

  const ref = document.getElementById('add');

  for (const [regex, selectors] of Object.entries(matches)) {
    const regexEl = document.createElement('textarea');
    regexEl.value = regex;
    regexEl.style.width = '50%';

    const selectorsEl = document.createElement('textarea');
    selectorsEl.value = selectors.join('\n');
    selectorsEl.style.width = '50%';

    const div = document.createElement('div');
    div.appendChild(regexEl);
    div.appendChild(selectorsEl);
    
    ref.parentElement.insertBefore(div, ref);
  }
};

const addOption = () => {
  const ref = document.getElementById('add');

  const regexEl = document.createElement('textarea');
  regexEl.style.width = '50%';

  const selectorsEl = document.createElement('textarea');
  selectorsEl.style.width = '50%';

  const div = document.createElement('div');
  div.appendChild(regexEl);
  div.appendChild(selectorsEl);
  
  ref.parentElement.insertBefore(div, ref);
};

const setup = () => {
  document.getElementById('save-button').addEventListener('click', saveOptions);
  document.getElementById('add-button').addEventListener('click', addOption);
};

window.addEventListener('DOMContentLoaded', restoreOptions);
window.addEventListener('DOMContentLoaded', setup);