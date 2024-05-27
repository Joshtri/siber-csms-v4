var tooltipTriggerList = [].slice.call(document.querySelectorAll('.custom-tooltip'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});