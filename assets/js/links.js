const handleAddEvent = function (e) {
    e.preventDefault();
    const body = {
        id: '000' + Math.floor(Math.random() * 1000) + 1000 + Date.now(),
        title: this.inputTitle.value,
        url: this.inputUrl.value,
        created_at: Date.now()
    }

    add(body);
    showList();
    clearInput();
}

let jsonFile = null;
const handleExportLinks = () => {
    // get current links
    const links = findAll();
    // convert links to blob with the type of json
    const data = new Blob([JSON.stringify(links)], { type: "application/json" });
    // Avoid memory leaks
    if (jsonFile !== null) {
        URL.revokeObjectURL(jsonFile);
    }

    jsonFile = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.setAttribute('download', 'links.json');
    link.href = jsonFile;
    document.body.appendChild(link);

    window.requestAnimationFrame(function () {
        const event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}

const handleImportLinks = function (e) {
    e.preventDefault();
    const file = this.fileJson.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
        const links = findAll();
        console.log(JSON.parse(e.target.result));
        links.push(...JSON.parse(e.target.result));
        save(links);
        showList();
    });
    reader.readAsBinaryString(file);
}

const clearInput = () => {
    inputTitle.value = '';
    inputUrl.value = '';
}

const findAll = (sort = "0") => {
    if (localStorage.getItem('data') == null) {
        localStorage.setItem('data', '[]');
        return [];
    } else {
        const data = JSON.parse(localStorage.getItem('data'));
        data.sort((a, b) => {
            if (sort == "0") { // 0 = by newest
                return b.created_at - a.created_at;
            } else if (sort == "1") {
                return a.created_at - b.created_at;
            }
        });
        return data;
    }
}

const add = body => {
    const data = findAll();
    data.push(body);
    save(data);
}

const showList = (keyword = null, sort) => {
    const data = findAll(sort);
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
                    <span class="item-created">created at ${new Date(data.created_at).toLocaleString()}</span>
                </div>
                <div class="flex ai-c">
                    <a href="${data.url}" class="btn btn-primary btn-visit" id="btnVisit" target="_blank" title="Open link to a new tab"><i class="fa fa-link"></i></a>
                    <button class="btn btn-danger btn-delete" data-id="${data.id}" title="Delete this link"><i class="fa fa-trash"></i></button>
                </div>
            </li>`;
}