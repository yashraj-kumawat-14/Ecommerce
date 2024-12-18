// getting modules for use
const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer');
const PORT = 5502;
const ORDERSFILEPATH = "./database/orders.json";
const USERSFILEPATH = "./database/users.json";
const PRODUCTSFILEPATH = "./database/products.json";
const SCRIPTSPATH = "scripts";
const CSSPATH = "css";
const PUBLICPAGES = "./public/pages";
const USERPAGES = "./user/pages";
const sessionId = {};
const Razorpay = require("razorpay");
const { json } = require("body-parser");
const user = "abc@gmail.com";
const password = "obkwhoqaisda3fqnvb";
const service = "gmail";
const emailCodes = {};
const verifiedEmails = {};


// Razorpay instance
const razorpay = new Razorpay({
    key_id: "rzp_test_cGj4ROYtoQrhfG",
    key_secret: "s5lqUM05W6EVdU9yjoTGIhYN",
});

// Function to read data from JSON file
const readData = () => {
    if (fs.existsSync("./database/orders.json")) {
        const data = fs.readFileSync("./database/orders.json", "utf-8");
        return JSON.parse(data);
    }
    return [];
};

function getOrders(email) {
    if (!email) {
        console.log("email argument is null or undefined");
        return null;
    } else {
        let allOrders = fs.readFileSync("./database/orders.json", "utf8");
        allOrders = JSON.parse(allOrders);
        let customerOrders = [];
        for (let order of allOrders) {
            if (order.email === email && order.status === "paid") {
                customerOrders.push(order);
            }
        }
        console.log("customer orders : for email ", email, customerOrders);
        return customerOrders;
    }
}

// Function to write data to JSON file
const writeData = (data) => {
    fs.writeFileSync("./database/orders.json", JSON.stringify(data, null, 2));
};

// Initialize orders.json if it doesn't exist
if (!fs.existsSync("./database/orders.json")) {
    writeData([]);
}

// Define email options
const mailOptions = {
    from: user, // Sender address
    to: null, // List of recipients
    subject: null, // Subject
    text: null // Email body
};

// usersilepath
const usersFilePath = path.join(__dirname, "database", "users.json");

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: service, // Use 'outlook' for Outlook, 'gmail' for Gmail, etc.
    auth: {
        user: user, // Your email
        pass: password // Your password or app password
    }
});



function getUser(email) {
    let userData = null;
    try {
        const data = fs.readFileSync(usersFilePath, "utf8"); // Synchronously read the file
        const users = JSON.parse(data); // Parse the JSON data
        userData = users.find((user) => user.email == email) || null; // Find the user
        if (userData) {
            console.log("found user data : ", userData)
        }
        else {
            console.log("not found data for email : ", email);
            console.log("users : ", users);
        }
    } catch (err) {
        console.error(err); // Handle any errors
    }
    return userData;
}

function getProduct(id) {
    let productData = null;
    try {
        const data = fs.readFileSync(`${PRODUCTSFILEPATH}`, "utf8"); // Synchronously read the file
        const products = JSON.parse(data); // Parse the JSON data
        productData = products.find((product) => product.id == id) || null; // Find the user
        if (productData) {
            console.log("found product data : ", productData)
        }
        else {
            console.log("not found data for product id : ", id);
            console.log("products : ", products);
        }
    } catch (err) {
        console.error(err); // Handle any errors
    }
    return productData;
}

function changePassword(user, res) {
    fs.readFile(USERSFILEPATH, "utf8", (err, data) => {
        let users = [];
        try {
            users = JSON.parse(data);
        }
        catch (err) {
            console.error(err);
        }
        for (let object of users) {
            if (object.email === user.email) {
                object.password = user.password;
                break;
            }
        }
        fs.writeFile(USERSFILEPATH, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.writeHead(100, { "Content-Type": "text/plain" });
                res.end("Please try registering with different email");
            }
            else {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("success")
                console.log("Password changed successfully . ");
            }
        });
    });
}

function sendMail(recipient, subject, message) {
    let mailConfig = mailOptions;
    mailOptions.to = recipient;
    mailOptions.subject = subject;
    mailOptions.text = message;
    transporter.sendMail(mailConfig, (error, info) => {
        if (error){
            console.error("Error : ", error);
            console.log("CHECK INTERNET CONNECTION");
            return;
        }
        else{
            console.log("Email sent : ", info.response);
        }
    })
}

async function addUser(user, res) {
    console.log("user : ", user);
    fs.readFile(USERSFILEPATH, "utf8", (err, data) => {
        let users = [];
        try {
            users = JSON.parse(data);
        }
        catch (err) {
            console.error(err);
        }
        for (let object of users) {
            if (object.email === user.email) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Email already exits. Try sign-in instead.");
                return;
            }
        }
        users.push(user);
        fs.writeFile(USERSFILEPATH, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.writeHead(100, { "Content-Type": "text/plain" });
                res.end("Please try registering later again");
            }
            else {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("registered")
                console.log("New user added successfully . ");
            }
        });
    });
}

function serverError(res) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal server error sorry for incovenience");
}

function getCookies(req, name) {
    const cookies = req.headers.cookie;
    // console.log('Received cookies:', cookies);  // Log cookies
    if (!cookies) return null;  // If there are no cookies, return null
    const cookiesArray = cookies.split(';');  // Split cookies into an array
    for (let cookie of cookiesArray) {
        const [key, value] = cookie.split('=');  // Split the cookie string into name and value
        // console.log(`Checking cookie: ${key}=${value}`);  // Log each cookie checked
        if (key === name) {
            // console.log(`Cookie found: ${name} = ${value}`);  // Log when cookie is found
            return value;
        }
    }
    return null;  // Return null if the cookie is not found
}


function generateSessionId() {
    let id = (Math.random().toString(36).substring(2, 15));
    while (sessionId[id]) {
        id = (Math.random().toString(36).substring(2, 15));
    }
    return id;
}

function setCookie(res, name, value, maxAge) {
    // res.setHeader('Set-Cookie', `${name}=${value}; Expires=${new Date(Date.now() + maxAge).toUTCString()}; HttpOnly; Path=/`);
    res.setHeader('Set-Cookie', `${name}=${value}; Expires=${maxAge}; HttpOnly; Path=/`);
}


function readUsersFile() {
    try {
        let data = fs.readFileSync(USERSFILEPATH, "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
}

// strings comparison
function levenshtein(a, b) {
    const tmp = [];
    let i, j, alen = a.length, blen = b.length, alen1 = alen + 1, blen1 = blen + 1;

    for (i = 0; i < alen1; i++) tmp[i] = [i];
    for (j = 0; j < blen1; j++) tmp[0][j] = j;

    for (i = 1; i < alen1; i++) {
        for (j = 1; j < blen1; j++) {
            tmp[i][j] = Math.min(
                tmp[i - 1][j] + 1,
                tmp[i][j - 1] + 1,
                tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }

    return tmp[alen][blen];
}

function similarityPercentage(str1, str2) {
    const len = Math.max(str1.length, str2.length);
    const distance = levenshtein(str1, str2);
    const similarity = ((len - distance) / len) * 100;
    return similarity.toFixed(2);
}

const server = http.createServer((req, res) => {
    // console.log(sessionId);
    if (req.method === "GET" && req.url === "/") {
        fs.readFile("./index.html", "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            }
            else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    } else if (req.method === "GET" && req.url.endsWith(".css")) {
        const cssPath = path.join(__dirname, CSSPATH, path.basename(req.url));
        fs.readFile(cssPath, "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            } else {
                res.writeHead(200, { "Content-Type": "text/css" });
                res.end(data);
            }
        });
    } else if (req.method === "GET" && req.url.endsWith(".js")) {
        const jsPath = path.join(__dirname, SCRIPTSPATH, path.basename(req.url));
        fs.readFile(jsPath, "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            } else {
                res.writeHead(200, { "Content-Type": "application/javascript" });
                res.end(data);
            }
        });
    } else if (req.method === "GET" && (req.url.startsWith("/assets/") || req.url.startsWith("/query/assets/") || req.url.startsWith("/product/assets/") || req.url.startsWith("/checkOutPage/assets/"))) {
        const imagePath = path.join(__dirname, "/assets/" + path.basename(req.url));
        // console.log(imagePath);
        const extname = path.extname(imagePath);
        const contentTypeMap = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
        };

        const contentType = contentTypeMap[extname];
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                serverError(res);
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            }
        });
    } else if (req.method === "GET" && req.url.startsWith("/query/")) {
        const query = decodeURIComponent(req.url.split("/query/")[1]);
        if (!query) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Client side error");
            return;
        }

        fs.readFile(PRODUCTSFILEPATH, "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            } else {
                const products = JSON.parse(data);
                const categoryProducts = products.filter((product) =>
                    (similarityPercentage(product.category.toLowerCase(), query.toLowerCase()) > 30) ||
                    (similarityPercentage(product.name.toLowerCase(), query.toLowerCase()) > 30)
                );

                fs.readFile(`${PUBLICPAGES}/searchResults.html`, "utf-8", (err, template) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Internal server error, error reading searchResults.html");
                    } else {
                        let data = "";
                        for (let product of categoryProducts) {
                            data += `
                                <div class="result" data-id=${product.id}>
                                    <div class="product-image">
                                        <img src="./assets/${product.id}.jpg" alt="${product.name}">
                                    </div>
                                    <div class="product-details">
                                        <div class="product-name">
                                            <p>${product.name}</p>
                                        </div>
                                        <div class="product-price">
                                            <p>${product.price}</p>
                                        </div>
                                    </div>
                                </div>`;
                        }

                        const page = template
                            .replace("{{query}}", query)
                            .replace("{{query}}", query)
                            .replace("{{data}}", data);

                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(page);
                    }
                });
            }
        });
    }
    else if (req.method === "GET" && req.url.startsWith("/product/")) {
        const id = decodeURIComponent(path.basename(req.url));
        // console.log("id", id);
        fs.readFile(`${PUBLICPAGES}/product.html`, "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            }
            else {
                const SESSIONID = getCookies(req, 'sessionId');
                console.log(SESSIONID);
                // const user = (sessionId[sessionId]) ? getUser(sessionId[SESSIONID].email) : null;
                fs.readFile(PRODUCTSFILEPATH, "utf-8", (err, productsData) => {
                    if (productsData) {
                        let productData = null;
                        productsData = JSON.parse(productsData);
                        for (let product of productsData) {
                            if (product.id == id) {
                                productData = product;
                                break;
                            }
                        }
                        if (productData) {
                            res.writeHead(200, { 'Content-Type': "text/html" });
                            const now = new Date();

                            // Add 7 days
                            const futureDate = new Date();
                            futureDate.setDate(now.getDate() + 7);
                            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                            // Format the date to yyyy-mm-dd
                            const formattedDate = futureDate.getFullYear() + '-' +
                                String(futureDate.getMonth() + 1).padStart(2, '0') + '-' + // Months are 0-based
                                String(futureDate.getDate()).padStart(2, '0') + String(days[futureDate.getDay()]);
                            console.log(sessionId[SESSIONID]);
                            const page = data.replace(/{{name}}/g, productData.name)
                                .replace(/{{id}}/g, productData.id)
                                .replace(/{{price}}/g, productData.price)
                                .replace(/{{expectedDelievery}}/g, formattedDate)
                                .replace(/{{state}}/g, (sessionId[SESSIONID]) ? (`${sessionId[SESSIONID].state}`) : "SIGN IN")
                                .replace(/{{city}}/g, (sessionId[SESSIONID] != null) ? (`${sessionId[SESSIONID].city}`) : "SIGN IN")
                                .replace(/{{area}}/, sessionId[SESSIONID] ? (`${sessionId[SESSIONID].area}`) : "SIGN IN")
                                .replace(/{{mobile}}/, sessionId[SESSIONID] ? (`${sessionId[SESSIONID].mobile}`) : "SIGN IN")
                                .replace(/{{totalCost}}/g, productData.price)
                                .replace(/{{description}}/g, productData.description)
                                .replace(/{{productId}}/g, id);
                            res.end(page);
                        }
                    }
                })
            }
        })
    } else if (req.method === "GET" && req.url === "/defaultDelieveryAddress") {
        // console.log(sessionId, typeof getCookies(req, 'sessionId'));
        const id = getCookies(req, 'sessionId');
        if (sessionId[id]) {
            // Valid session, show the page
            fs.readFile(`${USERPAGES}/defaultDelieveryPage.html`, "utf-8", (err, data) => {
                if (err) {
                    serverError(res);
                } else {
                    const { country, mobile, state, city, pincode, area } = sessionId[id];
                    data = data.replace(/{{country}}/g, country).replace(/{{state}}/g, state).replace(/{{city}}/g, city).replace(/{{pincode}}/g, pincode).replace(/{{mobile}}/g, mobile).replace(/{{area}}/g, area);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else {
            // No session, redirect to sign-in page
            res.writeHead(302, { "Location": "/signinpage" });
            res.end("Redirecting to sign-in page...");
        }
    }
    else if (req.method === "GET" && req.url === "/signinpage") {
        fs.readFile(`${PUBLICPAGES}/login.html`, "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            }
            else {

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        })
    }
    else if (req.method === "GET" && req.url === "/registerPage") {
        fs.readFile(`${PUBLICPAGES}/registration.html`, "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            }
            else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        })
    }
    else if (req.method === "GET" && req.url === "/accountDetailsPage") {

        // console.log(sessionId, typeof getCookies(req, 'sessionId'));
        const id = getCookies(req, 'sessionId');
        if (sessionId[id]) {
            // Valid session, show the page
            fs.readFile(`${USERPAGES}/accountDetailsPage.html`, "utf-8", (err, data) => {
                if (err) {
                    serverError(res);
                }
                else {
                    const { mobile, fullName, dob, email } = sessionId[id];
                    data = data.replace(/{{fullName}}/g, fullName).replace(/{{mobile}}/g, mobile).replace(/{{email}}/g, email).replace(/{{dob}}/g, dob);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else {
            // No session, redirect to sign-in page
            res.writeHead(302, { "Location": "/signinpage" });
            res.end("Redirecting to sign-in page...");
        }
    }
    else if (req.method === "GET" && req.url === "/recentOrdersPage") {
        const id = getCookies(req, 'sessionId');
        console.log("recent orders page me aayga");
        if (sessionId[id]) {
            console.log("session id hai present");
            // Valid session, show the page
            fs.readFile(`${USERPAGES}/recentOrdersPage.html`, "utf-8", (err, data) => {
                if (err) {
                    serverError(res);
                } else {
                    const orders = getOrders(sessionId[id].email);
                    let body = "";
                    orders.forEach((order) => {
                        let date1 = new Date();
                        let date2 = new Date(order.delieveryDate);

                        let status = (date1 < date2) ? "PENDING" : "DELIEVRED"
                        body += `<div class="order">
                <img src="./assets/${order.productId}.jpg" alt="product img" style="object-fit: contain; width: 100px;">
                <div class="order-details">
                    <div class="order-status">
                        <p style="display: inline;" class="order-label">ORDER STATUS : </p>
                        <p style="display: inline;">${status}</p>
                    </div>
                    <div class="order-name">
                        <p style="display: inline;" class="order-label">Name : </p>
                        <p style="display: inline;">${order.name}</p>
                    </div>
                    <div class="order-quantity">
                        <p style="display: inline;" class="order-label">Quantity : </p>
                        <p style="display: inline;">${order.quantity}</p>
                    </div>
                    <div class="delievery-on">
                        <p style="display: inline;" class="order-label">Delievery On : </p>
                        <p style="display: inline;">${order.delieveryDate}</p>
                    </div>
                    <div class="ordered-on">
                        <p style="display: inline;" class="order-label">Ordered On : </p>
                        <p style="display: inline;">${order.orderDate}</p>
                    </div>
                    <div class="total-cost">
                        <p style="display: inline;" class="order-label">Total Cost : </p>
                        <p style="display: inline;">${order.amount / 100}</p>
                    </div>
                </div>
            </div>`;
                    })
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data.replace(/{{data}}/g, body));
                }
            });
        } else {
            // No session, redirect to sign-in page
            res.writeHead(302, { "Location": "/signinpage" });
            res.end("Redirecting to sign-in page...");
        }
    }
    else if (req.method === "GET" && req.url === "/passwordRecoveryPage") {
        fs.readFile(`${PUBLICPAGES}/passwordRecoveryPage.html`, "utf-8", (err, data) => {
            if (err) {
                serverError(res);
            }
            else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        })
    }
    else if (req.method === "POST" && req.url === "/sign-in") {
        let body = '';
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const { email, password } = JSON.parse(body);
            // console.log(email, password);
            const users = readUsersFile();
            const user = users.find((u) => {
                return u.email === email && u.password === password;
            });
            if (user) {
                // Successful login
                const id = generateSessionId();
                const sessionTime = 600000; // 10 minutes session time (in milliseconds)

                sessionId[id] = { email, password };  // Save the session

                fs.readFile(USERSFILEPATH, "utf-8", (err, data) => {
                    if (data) {
                        let users = JSON.parse(data);
                        for (let user of users) {
                            if (user.email === email) {
                                sessionId[id].mobile = user.mobile;
                                sessionId[id].country = user.country;
                                sessionId[id].state = user.state;
                                sessionId[id].city = user.city;
                                sessionId[id].pincode = user.pincode;
                                sessionId[id].area = user.area;
                                sessionId[id].fullName = user.fullName;
                                sessionId[id].dob = user.dob;
                                break;
                            }
                        }
                    }
                })
                // setCookie(res, 'sessionId', id, sessionTime);
                setTimeout(() => {
                    console.log(`Session for ${id} has expired`);
                    delete sessionId[id]; // Delete session after the timeout
                }, sessionTime);

                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Set-Cookie': `sessionId=${id}; Max-Age=${sessionTime}; HttpOnly; Path=/`
                });
                res.end("success");
            } else {
                // Incorrect credentials
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid username or password.');
            }
        });
    }
    else if (req.method === "POST" && req.url === "/sendEmailCode") {
        let body = '';
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const { email } = JSON.parse(body);
            const subject = "Email code from Ecommerce";
            const emailCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code
            console.log(`Generated Email Code for ${email}:`, emailCode);

            const message = `This is your one-time email code for registration: \n${emailCode}`;


            fs.readFile(usersFilePath, "utf8", (err, data) => {
                if (err) {
                    serverError(res);
                }
                else {
                    let users = [];
                    try {
                        users = JSON.parse(data);
                    }
                    catch (err) {
                        console.error(err);
                    }
                    for (let object of users) {
                        if (object.email === email) {
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end("already exists");
                            return;
                        }
                    }
                    emailCodes[email] = emailCode;

                    setTimeout(() => {
                        delete emailCodes[email]; // Remove code after 2 minutes
                    }, 120000);
                    sendMail(email, subject, message);

                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Code is sent to your email.");
                }
            })

        });
    }

    else if (req.method === "POST" && req.url === "/verifyEmailCode") {
        let body = '';
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const { email, code } = JSON.parse(body);
            console.log(`Verification Attempt: Email - ${email}, Code - ${code}`);

            if (emailCodes[email] === code) {
                delete emailCodes[email];
                verifiedEmails[email] = true;
                setTimeout(() => {
                    delete verifiedEmails[email];
                }, 300000)
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("verified");
            } else {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("wrong");
            }
        });
    }
    else if (req.method === "POST" && req.url === "/saveRegisterDetails") {
        let body = '';
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const { email, mobile, password, city, state, country, area, fullName, pincode, dob } = JSON.parse(body);
            if (verifiedEmails[email]) {
                addUser({ email, fullName, mobile, dob, password, country, state, city, pincode, area }, res);
            }
            else {
                res.writeHead(100, { "Content-Type": "text/plain" });
                res.end("Please verify your email or try registering again later");
            }
        });
    }
    else if (req.method === "POST" && req.url === "/sendRevoveryEmailCode") {
        let body = '';
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const { email } = JSON.parse(body);
            const subject = "Account Recovery Email code from Ecommerce";
            const emailCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code
            console.log(`Generated Account recovery Email Code for ${email}:`, emailCode);

            const message = `This is your one-time email code for account recovery: \n${emailCode}`;


            fs.readFile(usersFilePath, "utf8", (err, data) => {
                if (err) {
                    serverError(res);
                }
                else {
                    let users = [];
                    try {
                        users = JSON.parse(data);
                    }
                    catch (err) {
                        console.error(err);
                    }
                    for (let object of users) {
                        if (object.email === email) {
                            sendMail(email, subject, message);
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end("Code is sent to your email.");
                            emailCodes[email] = emailCode;
                            setTimeout(() => {
                                delete emailCodes[email]; // Remove code after 2 minutes
                            }, 120000);
                            return;
                        }
                    }

                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("doesn't exists");
                }
            })

        });
    }
    else if (req.method === "POST" && req.url === "/changePassword") {
        let body = '';
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const { email, password } = JSON.parse(body);
            if (verifiedEmails[email]) {
                changePassword({ email, password }, res);
            }
            else {
                res.writeHead(100, { "Content-Type": "text/plain" });
                res.end("Please verify your email or try registering with different email.");
            }
        });
    }
    else if (req.method === "GET" && req.url.startsWith("/checkOutPage/")) {
        const productId = decodeURIComponent(path.basename(req.url));
        const SESSIONID = getCookies(req, "sessionId");
        if (sessionId[SESSIONID]) {
            console.log("reading checkoutpage");
            fs.readFile(`${USERPAGES}/checkOutPage.html`, "utf-8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                } else {
                    const now = new Date();

                    // Add 7 days
                    const futureDate = new Date();
                    futureDate.setDate(now.getDate() + 7);
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                    // Format the date to yyyy-mm-dd
                    const formattedDate = futureDate.getFullYear() + '-' +
                        String(futureDate.getMonth() + 1).padStart(2, '0') + '-' + // Months are 0-based
                        String(futureDate.getDate()).padStart(2, '0') + String(days[futureDate.getDay()]);

                    console.log("product id : ", productId);
                    productData = getProduct(productId);
                    data = data.replace(/{{name}}/g, productData.name).replace(/{{productId}}/g, productData.id).replace(/{{id}}/g, productData.id).replace(/{{price}}/g, productData.price).replace(/{{expectedDelievery}}/g, formattedDate).replace(/{{description}}/g, productData.description).replace(/{{email}}/g, sessionId[SESSIONID].email).replace(/{{userName}}/g, sessionId[SESSIONID].fullName).replace(/{{mobile}}/g, sessionId[SESSIONID].mobile);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        }
        else {
            console.log("session id not found");
            res.writeHead(302, { "Location": "/signinpage" });
            res.end();
        }
    }

    else if (req.method === "POST" && req.url === "/create-order") {
        console.log("request came into create-order.");
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            console.log("this is body : ", body);
            try {
                const { amount, currency, receipt, notes, productId, email } = JSON.parse(body);

                const options = {
                    amount: amount * 100, // Convert amount to paise
                    currency,
                    receipt,
                    notes,
                };

                const order = await razorpay.orders.create(options);
                const orders = readData();
                orders.push({
                    order_id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    receipt: order.receipt,
                    status: "created",
                    productId: productId,
                    email: email
                });
                writeData(orders);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(order));
            } catch (error) {
                console.error(error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error creating order");
            }
        });
    } else if (req.method === "POST" && req.url === "/verify-payment") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDate, delieveryDate, productName, quantity } = JSON.parse(body);

                const secret = razorpay.key_secret;
                const generatedSignature = require("crypto")
                    .createHmac("sha256", secret)
                    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                    .digest("hex");

                if (generatedSignature === razorpay_signature) {
                    const orders = readData();
                    const order = orders.find((o) => o.order_id === razorpay_order_id);
                    if (order) {
                        order.status = "paid";
                        order.payment_id = razorpay_payment_id;
                        order.orderDate = orderDate;
                        order.delieveryDate = delieveryDate;
                        order.quantity = quantity;
                        order.name = productName;
                        writeData(orders);
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ status: "ok" }));
                } else {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ status: "verification_failed" }));
                }
            } catch (error) {
                console.error(error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "error", message: "Error verifying payment" }));
            }
        });
    }
    else if (req.method === "GET" && req.url === "/payment-success") {
        fs.readFile(`${PUBLICPAGES}/success.html`, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" }); // Correctly handle errors
                res.end("Internal Server Error");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data); // Serve success.html file
            }
        });
    }
    else {
        // console.log(req.url);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page not found. Client side error");
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});