let register = document.querySelector(".register-button button");
let signin = document.querySelector(".signin-button button");
let form = document.querySelector("form");

form.addEventListener("submit", (evt)=>{
    evt.preventDefault();
})

register.addEventListener("click", (evt)=>{
    window.location.href = "/registerPage";
    
})

signin.addEventListener("click", (evt)=>{
    evt.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Password:', password);
    fetch("/sign-in", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({email:email, password:password})
    }).then((response)=>{
        return response.text();
    }).then(text =>{
        console.log(text);
        if(text==="success")
        // window.location.href = text;
        window.location.href = '/';
        else
        alert('Wrong credentials. Enter right credentials');
    })
})

