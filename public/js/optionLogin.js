function showForm(userType) {
    var pertaminaForm = document.getElementById('pertamina-biodata');
    var deleteOptionMitra = document.querySelector('.btn-access-login:nth-child(1)');

    var mitraForm = document.getElementById('mitra-biodata');
    var deleteOptionPertamina = document.querySelector('.btn-access-login:nth-child(2)');

    var backButton = document.querySelector('.btn-back');

    if (userType === 'mitra') {
      // Sembunyikan tombol kembali jika kembali ke Mitra
      backButton.classList.add('d-none');
      mitraForm.classList.remove('d-none');
      deleteOptionPertamina.classList.add('d-none');
      pertaminaForm.classList.add('d-none');
      deleteOptionMitra.classList.remove('d-none');
    } else if (userType === 'mitra') {
      // Sembunyikan tombol kembali jika kembali ke Mitra
      backButton.classList.add('d-none');
      mitraForm.classList.remove('d-none');
      deleteOptionPertamina.classList.add('d-none');
      pertaminaForm.classList.add('d-none');
      deleteOptionMitra.classList.remove('d-none');
    } 
    // else {
    //   // Kembali ke tampilan awal, sembunyikan semua formulir dan tombol
    //   backButton.classList.remove('d-none');
    //   pertaminaForm.classList.add('d-none');
    //   deleteOptionMitra.classList.remove('d-none');
    //   mitraForm.classList.add('d-none');
    //   deleteOptionPertamina.classList.remove('d-none');
    // }

    // Hapus atribut required dari semua input pada formulir yang ditampilkan
  //   var visibleForm = document.querySelector('.mt-2:not(.d-none) form');
  //   if (visibleForm) {
  //     var inputs = visibleForm.querySelectorAll('input, textarea');
  //     inputs.forEach(function (input) {
  //       input.removeAttribute('required');
  //     });
  //   }

  //       // Hapus atribut required dari semua input pada formulir yang ditampilkan
  // var visibleForm = document.querySelector('.mt-2:not(.d-none) form');
  // if (visibleForm) {
  //   var inputs = visibleForm.querySelectorAll('input, textarea');
  //   inputs.forEach(function (input) {
  //     input.removeAttribute('required');
  //   });
  // }
  }