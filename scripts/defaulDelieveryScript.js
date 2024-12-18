var signedIn = true;

// access elements

function initializeEventListeners() {
    let locationButton = document.querySelector(".location img");
    let recentOrdersButton = document.querySelector(".recent-orders img");
    let accountButton = document.querySelector(".account img");
    let searchButton = document.querySelector(".search-bar img");
    let searchInput = document.querySelector(".search-bar input");
    let categories = document.querySelectorAll(".category");

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


function searchQuery(query){
    if(query!==""){
        window.location.href = `/query/${encodeURIComponent(query)}`;
    }
}


function showSigninPage() {
    window.location.href = "/signinpage"
}
// gets default location page for delievery
function defaultLocationPage(){
    if(signedIn){
        // show delievery update page
        window.location.href = '/defaultDelieveryAddress';
    }
    else{
        // show sign in page
        showSigninPage();
        console.log("sign in page")
    }
}

// gets recent orders page
function recentOrdersPage(){
    if(signedIn){
        // show recent orders update page
        window.location.href = "/recentOrdersPage"
    }
    else{
        // show sign in page
        showSigninPage();
        console.log("sign in page")
    }
}

function accountDetailsPage(){
    if(signedIn){
        // show account details page
        window.location.href = "/accountDetailsPage";
    }
    else{
        // show sign in page
        showSigninPage();
        console.log("sign in page")
    }
}




initializeEventListeners();