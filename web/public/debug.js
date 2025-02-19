window.addEventListener('DOMContentLoaded', function() {
    fetch("https://pickle_admin/pageLoaded").then(function(response) {
        // PRODUCTION MODE
    }).catch(function(error) {
        // DEBUG MODE
    });
});