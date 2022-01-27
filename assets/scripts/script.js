const mainAddress = `https://divarfori-backend.iran.liara.run/`;
const Body = document.querySelector("body");

if (Body.getAttribute("data-page") === "Index") {
    document.getElementById("submit").addEventListener("click", async function() {

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        console.log(username, password);

        await fetch(`${mainAddress}api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: username,
                    pass: password,
                }),
            })
            .then((respone) => respone.json())
            .then((result) => {

                if (result.status_code === 200) {
                    localStorage.setItem("token", result.token);

                    window.location.href = "Dashboard.html";
                } else {
                    document.querySelector("#alert").innerHTML =
                        "نام کابری یا رمز عبور شما اشتباه است !";
                }
            });
    });
}


if (Body.getAttribute("data-page") === "Dashboard") {

}


if (Body.getAttribute("data-page") === "Users") {

}


if (Body.getAttribute("data-page") === "AddProduct") {

}


if (Body.getAttribute("data-paeg") === "ViewProduct") {

}


if (Body.getAttribute("data-page") === "DiscountCode") {

    const DiscontBtn = document.getElementById("generator");

    DiscontBtn.addEventListener("click", () => {
        //initialize a variable having alpha-numeric characters  
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

        //specify the length for the new string to be generated  
        var string_length = 8;
        var randomstring = '';

        //put a loop to select a character randomly in each iteration  
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        //display the generated string   
        document.getElementById("discount-code").value = randomstring;
    })

}


if (Body.getAttribute("data-page") === "Settings") {
    const Showpass = document.querySelector("#showpass");
    const PassInput = document.querySelector("#admin-password");

    Showpass.addEventListener("click", () => {
        if (PassInput.type === "password") {
            PassInput.type = "text";


        } else {
            PassInput.type = "password";
        }
    })


}