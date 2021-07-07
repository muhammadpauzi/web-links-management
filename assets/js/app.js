const listGroup = document.querySelector('.list-group');
const inputSearch = document.getElementById('inputSearch');
const btnShowFilters = document.querySelector('.btn-show-filters');
const filters = document.querySelector('.filters');
const btnBackToTop = document.querySelector('.btn-back-to-top');
const sortLinks = document.getElementById('sortLinks');
const formAddLink = document.getElementById('formAddLink');

window.addEventListener('scroll', () => {
    if (window.scrollY != 0) {
        btnBackToTop.classList.add('show');
    } else {
        btnBackToTop.classList.remove('show');
    }
});
formAddLink.addEventListener('submit', handleAddEvent);
btnBackToTop.addEventListener('click', () => {
    scrollTo({
        behavior: 'smooth',
        top: 0
    });
});
sortLinks.addEventListener('change', (e) => {
    showList(null, e.target.value);
});
btnShowFilters.addEventListener('click', function () {
    this.textContent = filters.classList.contains('show') ? 'Show Filters' : 'Hide Filters';
    filters.classList.toggle('show');
});
inputSearch.addEventListener('keyup', (e) => {
    showList(e.target.value);
});
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        if (confirm("Are you sure to remove this link?")) {
            const id = e.target.dataset.id;
            deleteData(id);
        }
    }
})

showList();