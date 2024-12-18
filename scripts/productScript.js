function buyNowHandler(productId) {
    const id = document.querySelector(".container").getAttribute("data-id"); // Get the `data-id` value
    if (id) {
        window.location.href = `/checkOutPage/${encodeURIComponent(id)}`;
        console.log(id);
    } else {
        console.error("Product ID not found");
    }
}

// access elements


function initializeEventListeners() {
    let locationButton = document.querySelector(".location img");
    let recentOrdersButton = document.querySelector(".recent-orders img");
    let accountButton = document.querySelector(".account img");
    let searchButton = document.querySelector(".search-bar img");
    let searchInput = document.querySelector(".search-bar input");
    let categories = document.querySelectorAll(".category");
    let buyNowButton = document.querySelector(".buy-now-button");

    buyNowButton.addEventListener("click", (evt) => {
        evt.preventDefault();
        const productId = document.querySelector(".container").getAttribute("data-id");
        buyNowHandler(productId);
    })

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

}


function searchQuery(query) {
    if (query !== "") {
        window.location.href = `/query/${encodeURIComponent(query)}`;
    }
}


function showSigninPage() {
    window.location.href = "/signinpage"
}
// gets default location page for delievery
function defaultLocationPage() {
    window.location.href = '/defaultDelieveryAddress';
}

// gets recent orders page
function recentOrdersPage() {
    window.location.href = "/recentOrdersPage"
}

function accountDetailsPage() {
    window.location.href = "/accountDetailsPage";

}




initializeEventListeners();