const inputTitle = document.getElementById('inputTitle');
const inputUrl = document.getElementById('inputUrl');
const btnAdd = document.getElementById('btnAdd');
const listGroup = document.querySelector('.list-group');
const inputSearch = document.getElementById('inputSearch');;

const addEventHandle = () => {
    const body = {
        id: '000' + Math.floor(Math.random() * 1000) + 1000 + Date.now(),
        title: inputTitle.value,
        url: inputUrl.value,
        created_at: Date.now()
    }
    if (!inputTitle.checkValidity()) {
        return inputTitle.reportValidity();
    }

    if (!inputUrl.checkValidity()) {
        return inputUrl.reportValidity();
    }

    add(body);
    showList();
    clearInput();
}

const clearInput = () => {
    inputTitle.value = '';
    inputUrl.value = '';
}

inputSearch.addEventListener('keyup', (e) => {
    showList(e.target.value);
});
btnAdd.addEventListener('click', addEventHandle);
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        if (confirm("Are you sure to remove this link?")) {
            const id = e.target.dataset.id;
            deleteData(id);
        }
    }
})

const findAll = () => {
    if (localStorage.getItem('data') == null) {
        localStorage.setItem('data', '[]');
        return false;
    } else {
        return JSON.parse(localStorage.getItem('data'));
    }
}

const add = body => {
    const data = findAll();
    data.push(body);
    save(data);
}

const showList = (keyword = null) => {
    const data = findAll();
    let temp = '';
    // Search links
    if (keyword) {
        data.map(d => {
            if (d.title.toLowerCase().includes(keyword.toLowerCase())) {
                temp += createListItem(d);
            }
        });
        // Message not found
        if (temp === '') {
            return listGroup.innerHTML = '<p class="error">Links not found.</p>';
        }
    } else {
        data.map(d => temp += createListItem(d));
    }
    // Message not found
    if (!data || data.length <= 0) {
        return listGroup.innerHTML = '<p class="error">Links not added yet.</p>';
    }
    listGroup.innerHTML = temp;
}

const deleteData = id => {
    const data = findAll();
    const newData = data.filter(d => d.id !== id);
    save(newData);
    showList();
}

const save = data => {
    localStorage.setItem('data', JSON.stringify(data));
}

const createListItem = data => {
    return `<li class="list-item flex ai-c">
                <div class="flex-1">
                    <span class="item-title">${data.title}</span>
                    <span class="item-url">${data.url}</span>
                </div>
                <div class="flex">
                    <a href="${data.url}" class="btn btn-primary btn-visit" id="btnVisit" target="_blank" title="Open link to a new tab"></a>
                    <button class="btn btn-danger btn-delete" data-id="${data.id}"></button>
                </div>
            </li>`;
}

showList();