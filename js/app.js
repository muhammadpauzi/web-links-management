import { generateId, add, deleteData, findAll, createListItem, save, loadDataLinkEdit, edit, clearDataLinkEdit, deleteAll } from "./utils.js";
import { btnBackToTop, formAddLink, formImportLinks, btnExport, inputSearch, linkAlert, listGroup, sortLinks, btnCollapse, btnCloseModal, formEditLink, btnDeleteAll } from "./elements.js";

const showAlert = (message, color = 'success') => {
    linkAlert.firstElementChild.textContent = message;
    linkAlert.setAttribute('class', 'alert alert-' + color);
    linkAlert.style.display = 'flex';
}

const handleAddEvent = function (e) {
    e.preventDefault();
    const body = {
        id: generateId(),
        title: this.inputTitle.value.trim(),
        url: this.inputUrl.value.trim(),
        created_at: Date.now(),
        updated_at: null,
    }

    add(body);
    showList(inputSearch.value, sortLinks.value);
    this.inputTitle.value = '';
    this.inputUrl.value = '';
    showAlert('Link has been added.');
}

const handleEditEvent = function (e) {
    e.preventDefault();
    const body = {
        id: this.inputIdEdit.value,
        title: this.inputTitleEdit.value.trim(),
        url: this.inputUrlEdit.value.trim(),
        created_at: parseInt(this.inputCreatedAtEdit.value),
        updated_at: Date.now(),
    }

    edit(body);
    showList(inputSearch.value, sortLinks.value);
    this.inputIdEdit.value = '';
    this.inputTitleEdit.value = '';
    this.inputUrlEdit.value = '';
    showAlert('Link has been edited.');
    document.querySelector('.backdrop').classList.remove('show');
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
        if (!keys.includes('id') || !keys.includes('title') || !keys.includes('created_at') || !keys.includes('url') || !keys.includes('updated_at')) {
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
        showList(inputSearch.value, sortLinks.value);
        showAlert('Link has been imported.');
    });
    reader.readAsBinaryString(file);
    this.reset();
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

// close alert
linkAlert.lastElementChild.addEventListener('click', function () {
    linkAlert.style.display = 'none';
});

window.addEventListener('scroll', () => {
    if (window.scrollY != 0) {
        btnBackToTop.classList.add('show');
    } else {
        btnBackToTop.classList.remove('show');
    }
});
btnExport.addEventListener('click', handleExportLinks);
formAddLink.addEventListener('submit', handleAddEvent);
formImportLinks.addEventListener('submit', handleImportLinks);
btnBackToTop.addEventListener('click', () => {
    scrollTo({
        behavior: 'smooth',
        top: 0
    });
});
sortLinks.addEventListener('change', (e) => {
    showList(inputSearch.value, e.target.value);
});
inputSearch.addEventListener('keyup', (e) => {
    showList(e.target.value);
});
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        if (confirm("Are you sure to remove this link?")) {
            const id = e.target.dataset.id;
            deleteData(id);
            showList(inputSearch.value, sortLinks.value);
            showAlert('Link has been deleted.');
        }
    }
    if (e.target.classList.contains('btn-detail')) {
        // rotate icon / image
        e.target.classList.toggle('active');
        // get element list-detail
        const elementDetail = e.target.parentElement.parentElement.nextElementSibling;
        // show element
        elementDetail.classList.toggle('flex');
    }
    if (e.target.classList.contains('btn-show-modal-edit')) {
        loadDataLinkEdit(e.target.dataset.id);
        const elementModal = document.getElementById(e.target.dataset.target);
        elementModal.classList.toggle('show');
    }
});
// handle collapse form
btnCollapse.addEventListener('click', function () {
    const targetElementCollapse = document.getElementById(this.dataset.target);
    if (targetElementCollapse.classList.contains('d-none')) {
        this.textContent = "Hide Form";
    } else {
        this.textContent = "Show Form";
    }
    targetElementCollapse.classList.toggle('d-none');
});
// hide/close modal
btnCloseModal.addEventListener('click', function () {
    const elementModal = document.getElementById(this.dataset.target);
    clearDataLinkEdit();
    elementModal.classList.remove('show');
});
// handle edit
formEditLink.addEventListener('submit', handleEditEvent);
btnDeleteAll.addEventListener('click', () => {
    if (confirm('Are you sure to delete all links?')) {
        deleteAll();
        showList();
        showAlert('All Links have been deleted.');
    }
});

showList();