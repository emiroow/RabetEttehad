const mainAddress = `https://divarfori-backend.iran.liara.run/`;
const elpinoApi = `https://elpino.liara.run/`
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

    document.addEventListener("DOMContentLoaded", function() {


        fetch(`${elpinoApi}api/admin/dashboard`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Token-Auth": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
                },
            })
            .then((respone) => respone.json())
            .then((result) => {
                console.log(result);
                $("#numofproducts").html(result.adv);
                $("#numofperson").html(result.bill);
                $("#numofseal").html(result.bime)
                $("#pmofpersson").html(result.charge)
                $("#numofAgent").html(result.internet)
            });
    });


}


if (Body.getAttribute("data-page") === "Users") {
    let usersCount;
    let page = 1;
    const showProductTable = function(data) {
        let result = "";
        let radif = 1;
        data.forEach((item) => {

            result += `

      <tr>
      <td>${radif}</td>
      <td>${item.name}</td>
      <td>${item.phoneNumber}</td>
      <td>ارومیه</td>
      <td>${item.dateTime.slice(0 , 16).split(" ").join("&nbsp;|&nbsp;")}</td>
      <td>آدرس</td>
      <td class="d-flex justify-content-center">
          <a href="User.html">
              <button class="accept-advertise button button-box button-xs button-primary ml-2 mr-2" id=${item._id}>
              <i class="accept-advertise zmdi fa fa-pencil-square-o" id=${item._id}></i>
          </button></a>
          <button class="reject-adver remove button button-box button-xs button-danger">
              <i class="reject-adver fa fa-trash-o"></i>
          </button>
      </td>
  </tr>

      `;
            radif++;
        });
        document.getElementById("users-table").innerHTML = result;
    };

    const getUserFromServer = () => {
        fetch(`https://elpino-api.liara.run/api/admin/fetchalluser/number=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
                },
            })
            .then((response) => response.json())
            .then((result) => {
                usersCount = result.user_count;
                $('#loading').hide();
                console.log(result);
                showProductTable(result.data);
            })
            .then(() => {
                (function(containerID, usersCount) {
                    var container = $(`#${containerID}`);
                    var sources = (function() {
                        var result = [];
                        for (var i = 1; i < usersCount; i++) {
                            result.push(i);
                        }
                        return result;
                    })();
                    var options = {
                        dataSource: sources,
                        showGoInput: true,
                        showGoButton: true,
                        goButtonText: "برو",
                        pageSize: 12,
                        pageNumber: page,
                        prevText: "&raquo;",
                        nextText: "&laquo;",
                        callback: function(response, pagination) {
                            var dataHtml = "<ul>";
                            $.each(response, function(index, item) {
                                dataHtml += "<li>" + item + "</li>";
                            });
                            dataHtml += "</ul>";
                            container.prev().html(dataHtml);
                        },
                    };
                    container.pagination(options);
                    container.addHook("afterPageOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        getUserFromServer();
                    });
                    container.addHook("afterGoButtonOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        getUserFromServer();
                    });
                    container.addHook("afterPreviousOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        getUserFromServer();
                    });
                    container.addHook("afterNextOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        getUserFromServer();
                    });
                })("pagination", usersCount);
            });
    };
    getUserFromServer();
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

if (Body.getAttribute("data-page") === "Orders") {

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