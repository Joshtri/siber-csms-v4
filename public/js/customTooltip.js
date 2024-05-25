
var tooltipTriggerList = [].slice.call(document.querySelectorAll('.custom-tooltip'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    // eslint-disable-next-line no-undef
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

