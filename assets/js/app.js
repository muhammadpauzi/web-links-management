const inputTitle = document.getElementById('inputTitle');
const inputUrl = document.getElementById('inputUrl');
const btnAdd = document.getElementById('btnAdd');
const listGroup = document.querySelector('.list-group');
const inputSearch = document.getElementById('inputSearch');
const btnShowFilters = document.querySelector('.btn-show-filters');
const filters = document.querySelector('.filters');
const sortLinks = document.getElementById('sortLinks');

sortLinks.addEventListener('change', (e) => {
    showList(null, e.target.value);
})
btnShowFilters.addEventListener('click', function () {
    this.textContent = filters.classList.contains('show') ? 'Show Filters' : 'Hide Filters';
    filters.classList.toggle('show');
});
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

showList();