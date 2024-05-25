var rowsPerPage = 5 ; // Jumlah baris per halaman
var currentPage = 1; // Halaman saat ini

function showTablePage(page) {
    var table = document.getElementById("data-table-view").getElementsByTagName('tbody')[0];
    var rows = table.rows;

    // Menghitung jumlah halaman yang diperlukan
    var totalPages = Math.ceil(rows.length / rowsPerPage);

    // Menampilkan data pada halaman yang dipilih
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    for (var i = 0; i < rows.length; i  ++) {
        if (i < startIndex || i >= endIndex) {
            rows[i].style.display = 'none';
        } else {
            rows[i].style.display = '';
        }
    }

    // Membuat tombol pagination dinamis
    var paginationButtons = document.getElementById("pagination-buttons");
    paginationButtons.innerHTML = "";
    for (var i = 1; i <= totalPages; i++) {
        var button = document.createElement("button");
        button.innerText = i;
        button.onclick = function () {
            currentPage = parseInt(this.innerText);
            showTablePage(currentPage);
        };
        if (i == currentPage) {
            button.classList.add("active");
        }
        paginationButtons.appendChild(button);
    }
}

// Memanggil fungsi untuk menampilkan data pada halaman pertama
showTablePage(currentPage);
