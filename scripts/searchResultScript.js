var signedIn = true;

// access elements

function showSigninPage() {
    window.location.href = "/signinpage"
}

function initializeEventListeners() {
    let locationButton = document.querySelector(".location img");
    let recentOrdersButton = document.querySelector(".recent-orders img");
    let accountButton = document.querySelector(".account img");
    let searchButton = document.querySelector(".search-bar img");
    let searchInput = document.querySelector(".search-bar input");
    let results = document.querySelectorAll(".result");

    locationButton?.addEventListener("click", (evt) => {
        evt.preventDefault();
        defaultLocationPage();
    });

    recentOrdersButton?.addEventListener("click", (evt) => {
        evt.preventDefault();
        recentOrdersPage();
    });

    accountButton?.addEventListener("click", (evt) => {
        evt.preventDefault();
        accountDetailsPage();
    });

    searchButton?.addEventListener("click", (evt) => {
        evt.preventDefault();
        searchQuery(searchInput.value);
    });

    searchInput?.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
            searchQuery(searchInput.value);
        }
    });

    for (let result of results) {
        result.addEventListener("click", (evt) => {
            const id = result.getAttribute("data-id"); // Get the `data-id` value
            if (id) {
                window.location.href = `/product/${encodeURIComponent(id)}`;
                console.log(id);
            } else {
                console.error("Product ID not found");
            }
        })
    }
}


// gets search result page from the server and displays it
function searchQuery(query) {
    if (query !== "") {
        window.location.href = `/query/${encodeURIComponent(query)}`;
    }
}

// gets default location page for delievery
function defaultLocationPage() {
    if (signedIn) {
        // show delievery update page
        window.location.href = '/defaultDelieveryAddress';
    }
    else {
        // show sign in page
        showSigninPage();
        console.log("sign in page")
    }
}

// gets recent orders page
function recentOrdersPage() {
    if (signedIn) {
        // show recent orders page
        window.location.href = "/recentOrdersPage"
    }
    else {
        // show sign in page
        showSigninPage();
        console.log("sign in page")
    }
}

function accountDetailsPage() {
    if (signedIn) {
        // show account details page
        window.location.href = "/accountDetailsPage";
    }
    else {
        // show sign in page
        showSigninPage();
        console.log("sign in page")
    }
}




initializeEventListeners();