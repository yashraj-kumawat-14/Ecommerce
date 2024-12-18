const form = document.querySelector("form");
const nextButton = document.querySelector(".next-button button");
const signin = document.querySelector(".signin-button button");
const register = document.querySelector(".register-button button");
const emailCodeButton = document.querySelector("#send-email-code");
const emailVerifyButton = document.querySelector(".email-verify-button");


emailVerifyButton.disabled = true;


form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const email = document.querySelector("#email").value;
    const retypeEmail = document.querySelector("#retypeEmail").value;
    const state = document.querySelector("#state").value;
    const country = document.querySelector("#country").value;
    const city = document.querySelector("#city").value;
    const pincode = document.querySelector("#pincode").value;
    const area = document.querySelector("#area").value;
    const dob = document.querySelector("#dob").value;
    const fullName = document.querySelector("#fullName").value;

    // Regular expression for validating an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!email || !retypeEmail || email !== retypeEmail) {
        alert("Please enter your email and confirm it.");
        return;
    }

    const mobile = document.querySelector("#mobile").value;
    const mobileRegex = /^\d{10}$/;

    if (!mobileRegex.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    if (!mobile || mobile.length != 10) {
        alert("Please write mobile no. please");
        return;
    }

    const password = document.querySelector("#password").value;
    const retypePassword = document.querySelector("#retypePassword").value;
    if (password !== retypePassword || password.length < 0) {
        alert("Please type password correctly");
        return;
    }

    fetch("/saveRegisterDetails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, mobile, password, city, state, country, area, fullName, pincode, dob })
    }).then((response) => {
        return response.text();
    }).then((text) => {
        alert(text);
        if (text == 'registered') {
            window.location.href = "/signinpage";
        }
    });

});

nextButton.addEventListener("click", () => {
    form.scrollBy({ top: 100, behavior: "smooth" });
});

signin.addEventListener("click", () => {
    window.location.href = "/signinpage";
});

emailCodeButton.addEventListener("click", () => {
    const email = document.querySelector("#email").value;
    const retypeEmail = document.querySelector("#retypeEmail").value;
    // Regular expression for validating an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!email || !retypeEmail || email !== retypeEmail) {
        alert("Please enter your email and confirm it.");
        return;
    }

    console.log("Sending email code...");
    fetch("/sendEmailCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
        .then((response) => response.text())
        .then((text) => {
            console.log(text);
            if (text == "already exists") {
                alert("Email already exists try sign in instead");
                window.location.href="/signinpage";
            }
            else {
                emailVerifyButton.disabled = false;
                alert("Email code is sent to your email");
            }
        });

    emailCodeButton.disabled = true;
    setTimeout(() => {
        emailCodeButton.disabled = false;
        emailVerifyButton.disabled = true;
    }, 120000);
});

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
                const retypeEmail = document.querySelector("#retypeEmail").disabled = true;

                emailVerifyButton.disabled = true;

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

