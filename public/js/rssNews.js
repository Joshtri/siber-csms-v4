// Fungsi untuk mengambil dan menampilkan konten RSS
function tampilkanBerita() {
    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.antaranews.com/rss/hukum.xml'))
        .then(response => response.json())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');

            items.forEach(item => {
                const title = item.querySelector('title').textContent;
                const link = item.querySelector('link').textContent;
                const description = item.querySelector('description').textContent;

                // Ambil gambar/thumbnail dari konten berita jika tersedia
                const thumbnail = item.querySelector('enclosure');
                const thumbnailUrl = thumbnail ? thumbnail.getAttribute('url') : 'placeholder.jpg';

                const beritaHtml = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${thumbnailUrl}" class="card-img-top" alt="Thumbnail">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                            
                            </div>
                            <div class="card-footer">
                                <a href="${link}" class="card-link" target="_blank">Baca lebih lanjut</a>
                            </div>
                        </div>
                    </div>
                `;
                
                document.getElementById('berita-container').innerHTML += beritaHtml;
            });
        })
        .catch(error => console.error(error));
}

// Memanggil fungsi untuk menampilkan berita saat halaman dimuat
tampilkanBerita();