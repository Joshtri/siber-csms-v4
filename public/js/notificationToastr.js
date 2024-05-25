function checkPINLength() {
    const PINInput = document.getElementById("password");
    const maxPINLength = 11;

    if (PINInput.value.length >= maxPINLength) {
        // Jika panjang PIN melebihi maksimum, potong PIN menjadi 10 digit
        PINInput.value = PINInput.value.slice(0, maxPINLength);
        toastr.error("Panjang PIN tidak boleh melebihi 10 digit!", "Peringatan");
    } else {
        // Jika panjang PIN tidak melebihi maksimum, bersihkan notifikasi Toastr
        toastr.clear();
    }
}
