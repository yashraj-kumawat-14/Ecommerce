const form = document.querySelector("form");
const nextButton = document.querySelector(".next-button button");
const signin =  document.querySelector(".signin-button button");
const saveAndContinueButton = document.querySelector(".save-continue-button button");
const newPass = document.querySelector("#password");
const retypeNewPass = document.querySelector("#retypePassword");
const passDiv = document.querySelector(".password");
const retypeNewPassDiv = document.querySelector(".retype-password");
const emailVerifyButton = document.querySelector(".email-verify-button");
const sendCodeButton  = document.querySelector(".send-code-button");

newPass.disabled = true;
retypeNewPass.disabled = true;
emailVerifyButton.disabled = true;

emailVerifyButton.addEventListener("click", () => {
    const code = document.querySelector("#emailCode").value;
    const email = document.querySelector("#email").value;

    if (!code || !email) {
        alert("Please fill in both email and code fields.");
        return;
    }

    fetch("/verifyEmailCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Verification failed");
            }
        })
        .then((text) => {
            if (text === "verified") {
                emailVerifyButton.innerText = "Verified";
                const email = document.querySelector("#email").disabled = true;

                emailVerifyButton.disabled = true;
                sendCodeButton.disabled=true;
                newPass.disabled = false;
                retypeNewPass.disabled = false;

                document.querySelector("#emailCode").disabled = true;
                emailVerifyButton.style.backgroundColor = "green";
                alert("Email successfully verified");
            }

        })
        .catch((error) => {
            emailVerifyButton.style.backgroundColor = "red";
            alert("Verification failed. Please try again.");
            console.error(error);
        });
});

sendCodeButton.addEventListener("click", (evt)=>{
    const email = document.querySelector("#email").value;
    
    // Regular expression for validating an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    fetch("/sendRevoveryEmailCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
        .then((response) => response.text())
        .then((text) => {
            console.log(text);
            if (text == "doesn't exists") {
                alert("Email doesn't exists try registering instead");
                window.location.href="/registerPage";
            }
            else {
                emailVerifyButton.disabled = false;
                alert("Email code is sent to your email");
            }
        });

    sendCodeButton.disabled = true;
    setTimeout(() => {
        sendCodeButton.disabled = false;
        emailVerifyButton.disabled = true;
    }, 120000);
})


passDiv.addEventListener("click", (evt)=>{
    if(newPass.disabled===true){
        alert("Please verify your email first")
    }
})

retypeNewPassDiv.addEventListener("click", (evt)=>{
    if(retypeNewPass.disabled===true){
        alert("Please verify your email first")
    }
})

form.addEventListener("submit", (evt)=>{
    evt.preventDefault();
    const email = document.querySelector("#email").value;
    
    // Regular expression for validating an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const password = document.querySelector("#password").value;
    const retypePassword = document.querySelector("#retypePassword").value;
    if (password !== retypePassword || password.length < 0) {
        alert("Please type password correctly");
        return;
    }

    fetch("/changePassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email,  password })
    }).then((response) => {
        return response.text();
    }).then((text) => {
        alert(text);
        if (text == 'success') {
            window.location.href = "/signinpage";
        }
    });


})

nextButton.addEventListener("click", (event)=>{
    form.scrollBy({top:100, behavior:"smooth"})
})

signin.addEventListener("click", (event)=>{
    window.location.href = "/signinpage";
})

