function initializeEventListeners() {
    let locationButton = document.querySelector(".location img");
    let recentOrdersButton = document.querySelector(".recent-orders img");
    let accountButton = document.querySelector(".account img");
    let searchButton = document.querySelector(".search-bar img");
    let searchInput = document.querySelector(".search-bar input");
    let quantity = document.querySelector("#quantity");
    let amount = document.querySelector("#amount");

    quantity.addEventListener("change", (evt)=>{
        // console.log("hello price = ", quantity.getAttribute("price")*2, "value = ", quantity.value);
        amount.value = (quantity.getAttribute("price"))*quantity.value;
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



function searchQuery(query){
    if(query!==""){
        window.location.href = `/query/${encodeURIComponent(query)}`;
    }
}


// gets default location page for delievery
function defaultLocationPage(){
    // show delievery update page
    window.location.href = '/defaultDelieveryAddress';
}

// gets recent orders page
function recentOrdersPage(){
    // show recent orders update page
    window.location.href = "/recentOrdersPage"
}

function accountDetailsPage(){
    // show account details page
    window.location.href = "/accountDetailsPage";
}

initializeEventListeners();