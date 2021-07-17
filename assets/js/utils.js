import { sortLinks } from "./elements.js";

const generateId = () => {
    return '000' + Math.floor(Math.random() * 1000) + 1000 + Date.now();
}

const add = body => {
    const data = findAll();
    data.push(body);
    save(data);
}

const findAll = (sort = "0") => {
    if (localStorage.getItem('data') == null) {
        localStorage.setItem('data', '[]');
        return [];
    } else {
        const data = JSON.parse(localStorage.getItem('data'));
        data.sort((a, b) => {
            switch (sort) {
                case "0": // by asc date created
                    return b.created_at - a.created_at;
                case "1": // by desc data created
                    return a.created_at - b.created_at;
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
                default:
                    return b.created_at - a.created_at;
            }
        });
        return data;
    }
}

const deleteData = id => {
    const data = findAll(sortLinks.value);
    const newData = data.filter(d => d.id !== id);
    save(newData);
}

const save = data => {
    localStorage.setItem('data', JSON.stringify(data));
}

const createListItem = data => {
    return `<li class="list-item flex ai-c">
                <div class="flex-1">
                    <span class="item-title">${data.title}</span>
                    <span class="item-url">${data.url}</span>
                    <span class="item-created">created at ${new Date(data.created_at).toLocaleString()}</span>
                </div>
                <div class="flex ai-c">
                    <a href="${data.url}" class="btn btn-primary btn-visit" id="btnVisit" target="_blank" title="Open link to a new tab"></a>
                    <button class="btn btn-danger btn-delete" data-id="${data.id}" title="Delete this link"></button>
                </div>
            </li>`;
}

export {
    generateId,
    add,
    save,
    findAll,
    createListItem,
    deleteData
}