const listGroup = document.querySelector('.list-group');
const inputSearch = document.getElementById('inputSearch');
const btnShowFilters = document.querySelector('.btn-show-filters');
const btnExport = document.querySelector('.btn-export');
const btnBackToTop = document.querySelector('.btn-back-to-top');
const sortLinks = document.getElementById('sortLinks');
const formAddLink = document.getElementById('formAddLink');
const formImportLinks = document.getElementById('formImportLinks');
const tabItems = document.querySelectorAll('.tabs-group .tab-item');

// close alert
linkAlert.lastElementChild.addEventListener('click', function () {
    linkAlert.style.display = 'none';
});
const handleTabs = function (index) {
    tabItems.forEach((item, indexItem) => {
        if (index !== indexItem) { // close other
            item.style.display = 'none';
        } else {
            if (item.style.display == 'block') { // for close tab
                item.style.display = 'none';
            } else {
                item.style.display = 'block'; // show tab
            }
        }
    })
}
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
    showList(null, e.target.value);
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
})

showList();