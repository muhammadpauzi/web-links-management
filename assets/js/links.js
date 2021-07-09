const linkAlert = document.querySelector('.alert.link-alert');

const showAlert = (message, color = 'success') => {
    linkAlert.firstElementChild.textContent = message;
    linkAlert.setAttribute('class', 'alert alert-' + color);
    linkAlert.style.display = 'flex';
}


const handleAddEvent = function (e) {
    e.preventDefault();
    const body = {
        id: generateId(),
        title: this.inputTitle.value,
        url: this.inputUrl.value,
        created_at: Date.now()
    }

    add(body);
    showList();
    clearInput();
    showAlert('Link has been added.');
}

const generateId = () => {
    return '000' + Math.floor(Math.random() * 1000) + 1000 + Date.now();
}

let jsonFile = null;
const handleExportLinks = () => {
    if (confirm('Are you sure to download this file?')) {
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
}

const handleImportLinks = function (e) {
    e.preventDefault();
    const file = this.fileJson.files[0];
    if (file.type !== "application/json") {
        return showAlert('Import failed, The File type is not valid.', 'danger');
    }
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
        const links = findAll();
        let importedLinks = JSON.parse(e.target.result);
        let keys;
        if (!Array.isArray(importedLinks)) {
            keys = Object.keys(importedLinks);
        } else {
            keys = Object.keys(importedLinks[0]);
        }
        if (!keys.includes('id') || !keys.includes('title') || !keys.includes('created_at') || !keys.includes('url')) {
            return showAlert('Import failed, The file is wrong.', 'danger');
        }
        links.map(link => {
            importedLinks.map(importedLink => {
                if (link.id == importedLink.id) {
                    importedLink.id = generateId();
                }
            })
        });
        links.push(...importedLinks);
        save(links);
        showList();
        showAlert('Link has been imported.');
    });
    reader.readAsBinaryString(file);
    this.reset();
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
            if (d.title.toLowerCase().includes(keyword.toLowerCase()) || d.url.toLowerCase().includes(keyword.toLowerCase())) {
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