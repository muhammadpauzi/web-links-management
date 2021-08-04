import { sortLinks, formEditLink } from "./elements.js";

const generateId = () => {
    return '000' + Math.floor(Math.random() * 1000) + 1000 + Date.now();
}

const add = body => {
    const data = findAll();
    data.push(body);
    save(data);
}

const edit = body => {
    const data = findAll().filter(d => d.id !== body.id);
    data.push(body);
    save(data);
}

const findAll = (sort = "1") => {
    if (localStorage.getItem('data') == null) {
        localStorage.setItem('data', '[]');
        return [];
    } else {
        const data = JSON.parse(localStorage.getItem('data'));
        data.sort((a, b) => {
            switch (sort) {
                case "0": // by asc date created
                    return a.created_at - b.created_at;
                case "1": // by desc data created
                    return b.created_at - a.created_at;
                case "2": // by asc title
                    if (a.title < b.title) {
                        return -1;
                    }
                    if (a.title > b.title) {
                        return 1;
                    }
                    return 0;
                case "3": // by desc title
                    if (a.title > b.title) {
                        return -1;
                    }
                    if (a.title < b.title) {
                        return 1;
                    }
                    return 0;
                case "4": // by asc date updated
                    if (a.updated_at && b.updated_at) {
                        return 1;
                    }
                    if (a.updated_at == null) {
                        console.log("sampai a null", a.title)
                        return -1;
                    }
                    if (b.updated_at == null) {
                        console.log("sampai b null", a.title)
                        return 1;
                    }
                    return 0;
                case "5": // by desc date updated
                    if (a.updated_at && b.updated_at) {
                        console.log("sampai a dan b tidak null")
                        return -1;
                    }
                    if (a.updated_at == null) {
                        console.log("sampai a null")
                        return 1;
                    }
                    if (b.updated_at == null) {
                        console.log("sampai b null")
                        return -1;
                    }
                    return 0;
                default:
                    return b.created_at - a.created_at;
            }
        });
        return data;
    }
}

const deleteData = id => {
    const newData = findAll(sortLinks.value).filter(d => d.id !== id);
    save(newData);
}

const deleteAll = () => {
    save([]);
}

const save = data => {
    localStorage.setItem('data', JSON.stringify(data));
}

const loadDataLinkEdit = (id) => {
    const data = findAll().filter(d => d.id === id)[0];
    formEditLink.inputTitleEdit.value = data.title;
    formEditLink.inputUrlEdit.value = data.url;
    formEditLink.inputIdEdit.value = data.id;
    formEditLink.inputCreatedAtEdit.value = data.created_at;
}

const clearDataLinkEdit = (id) => {
    formEditLink.inputTitleEdit.value = '';
    formEditLink.inputUrlEdit.value = '';
    formEditLink.inputIdEdit.value = '';
    formEditLink.inputCreatedAtEdit.value = '';
}

const createListItem = data => {
    return `<li class="list-item">
                <div class="flex ai-c">
                    <div class="flex-1">
                        <span class="item-title">${data.title}</span>
                        <span class="item-url">${data.url}</span>
                    </div>
                    <div class="flex ai-c">
                        <a href="${data.url}" class="btn btn-primary btn-visit" id="btnVisit" target="_blank" title="Open link to a new tab"></a>
                        <button class="btn btn-secondary btn-detail" title="Show detail and action buttons"></button>
                    </div>
                </div>
                <div class="list-detail d-none ai-c">
                    <div class="flex-1">
                        <span class="item-created">created at ${new Date(data.created_at).toLocaleString()}</span>
                        <span class="item-updated">${data.updated_at ? 'updated at ' + new Date(data.updated_at).toLocaleString() : 'Not updated yet'}</span>
                    </div>
                    <div class="flex ai-c">
                        <button class="btn btn-primary btn-show-modal-edit" data-id="${data.id}" data-target="modalEdit" title="Edit this link"></button>
                        <button class="btn btn-danger btn-delete" data-id="${data.id}" title="Delete this link"></button>
                    </div>
                </div>
            </li>`;
}

export {
    generateId,
    add,
    save,
    findAll,
    createListItem,
    deleteData,
    loadDataLinkEdit,
    edit,
    clearDataLinkEdit,
    deleteAll
}