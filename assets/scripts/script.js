const RabetApi = `https://rabetettehad.herokuapp.com/`
const Body = document.querySelector("body");

const toast = function (event, color) {
    Toastify({
        text: event,
        duration: 2000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: false,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
            background: `${color}`,
        },
        onClick: function () { } // Callback after click
    }).showToast();

}
const toastRedColor = '#e52e2e';
const toastGreenColor = '#70e52e';

// api call function
const fetchApi = async (url, body) => {
    let lastResult;
    try {
        if (body) {
            await fetch(`${RabetApi}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('token')
                },
                body: JSON.stringify(body),
            })
                .then(respone => respone.json())
                .then(result => lastResult = result)
                .catch(err => toast(err, '#b90000'))
        } else {
            await fetch(`${endPoint}${url}`, {
                method: 'GET',
                headers: {
                    'Auth-Token': localStorage.getItem('token')
                },
            })
                .then(respone => respone.json())
                .then(result => { lastResult = result })
                .catch(err => toast(err, '#b90000'))
        }

    } catch (err) {
        toast(err, '#b90000');
        lastResult = err;
    };
    return lastResult;
};

if (Body.getAttribute("data-page") === "Index") {
    document.getElementById("submit").addEventListener("click", async function () {

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        await fetch(`${RabetApi}api/admin/login`, {
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
                console.log(result);

                if (result.status_code === 200) {
                    localStorage.setItem("token", result.token);
                    window.location.href = "Dashboard.html";
                } else {
                    document.querySelector("#alert").innerHTML =
                        "نام کابری یا رمز عبور شما اشتباه است !";
                }
            }).catch((error) => {
                console.log(error);
            })
    });
}


if (Body.getAttribute("data-page") === "Dashboard") {

    document.addEventListener("DOMContentLoaded", function () {


        fetch(`${RabetApi}api/admin/dashboard`, {
            method: "POST",

        })
            .then((respone) => respone.json())
            .then((result) => {
                $("#numofproducts").html(result.adv);
                $("#numofperson").html(result.user);
                $("#numofseal").html(result.shop)
                $("#pmofpersson").html(result.charge)
                $("#numofAgent").html(result.agent)

            }).catch((err) => {
                console.log("هوووووووووووووویآح ، ریدی داداش");
            })
    });


}


if (Body.getAttribute("data-page") === "Users") {
    let usersCount;
    let page = 1;
    const showProductTable = function (data) {
        let result = "";
        let radif = 1;
        data.forEach((item) => {
            result += `
      <tr>
      <td>${radif}</td>
      <td>${item.name}</td>
      <td>${item.phoneNumber}</td>
      <td>ارومیه</td>
      <td>${item.dateTime.slice(0, 16).split(" ").join("&nbsp;|&nbsp;")}</td>
      <td>آدرس</td>
      <td class="d-flex justify-content-center">
              <button class="Edite-advertise button button-box button-xs button-primary ml-2 mr-2" id=${item._id}>
              <i class="Edite-advertise zmdi fa fa-pencil-square-o" id=${item._id}></i>
          </button>
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
        fetch(`${RabetApi}api/admin/fetchalluser/number=${page}`, {
            method: "GET",
            headers: {
                'Auth-Token': localStorage.getItem('token'),
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((result) => {
                usersCount = result.user_count;
                console.log(result);
                showProductTable(result.data);
            })
            .then(() => {
                (function (containerID, usersCount) {
                    var container = $(`#${containerID}`);
                    var sources = (function () {
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
                        callback: function (response, pagination) {
                            var dataHtml = "<ul>";
                            $.each(response, function (index, item) {
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
            })
            .then(() => {
                $('.Edite-advertise').on("click", (e) => {
                    window.location.href = `user.html?${e.target.id}`
                })
            })

    };
    getUserFromServer();



    // serach fetch api
    const searchtable = function (data) {
        let result = "";
        let radif = 1;
        data.forEach((item) => {
            result += `
      <tr>
      <td>${radif}</td>
      <td>${item.name}</td>
      <td>${item.phoneNumber}</td>
      <td>ارومیه</td>
      <td>${item.dateTime.slice(0, 16).split(" ").join("&nbsp;|&nbsp;")}</td>
      <td>آدرس</td>
      <td class="d-flex justify-content-center">
              <button class="Edite-advertise button button-box button-xs button-primary ml-2 mr-2" id=${item._id}>
              <i class="Edite-advertise zmdi fa fa-pencil-square-o" id=${item._id}></i>
          </button>
          <button class="reject-adver remove button button-box button-xs button-danger">
              <i class="reject-adver fa fa-trash-o"></i>
          </button>
      </td>
  </tr>
            `;
            radif++;

        });
        document.getElementById("users-table").innerHTML = result;
    }
    $("#SearchBtn").on('click', () => {
        $("#users-table").html("");
        $("#pagination").html("");
        let phoneNumber = $("#SearchText").val();
        fetch(`https://elpino-api.liara.run/api/admin/fetchuser/search/number=${phoneNumber}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            }
        })
            .then((response) => response.json())
            .then((result) => {
                searchtable(result.data);
            })

    })
}


if (Body.getAttribute("data-page") === "User") {

    let userId = document.URL.split('?')[1]
    fetch(`https://elpino-api.liara.run/api/admin/fetchuser/one/id=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
        },
    })
        .then((response) => response.json())
        .then((result) => {
            $("#user-name").val(result.data[0].name);
            $('#user-phone').val(result.data[0].phoneNumber);
            result.data[0].adress.forEach(item => {
                $('.info-address').append(`
            <input type="text" class="form-control mb-20 mt-0 user-address" placeholder="آدرس"
                class="form-control mb-20 mt-0" aria-label="Default" value="${item}"
                aria-describedby="inputGroup-sizing-default">
        `);
                $('#user-date').val(result.data[0].dateTime.slice(0, 11));
                $('#user-description').val(result.data[0].dis);
                $('#user-name-right').html(result.data[0].name);
                // $('#user-coin-right').html(`${sliceNumber(result.data[0].coin)} ریال`);

            });
        })


    $("#user-form").on("submit", () => {
        let userAddresses = [];
        [...document.querySelectorAll('.user-address')].map(item => userAddresses.push(item.value));

        fetch(`https://elpino-api.liara.run/api/admin/user/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            },
            body: JSON.stringify({
                id: userId,
                name: $('#user-name').val(),
                dis: $('#user-description').val(),
                mony: parseInt($('#user-coin-right').val()),
                adress: userAddresses,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status_code === 200) {
                    toast();
                    setTimeout(() => {
                        window.location.href = "users.html";
                    }, 2000);
                }
            })
    })

}


if (Body.getAttribute("data-page") === "AddProduct") {

    FilePond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,
        FilePondPluginImageValidateSize, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

    FilePond.create($('#file-pond')[0], {
        imagePreviewHeight: 140,
        imageValidateSizeMaxWidth: 500,
        imageValidateSizeMaxHeight: 500,
        imageValidateSizeLabelExpectedMaxSize: 'سایز عکس ها تا 500 * 500',
        acceptedFileTypes: ['image/png'],
        maxFileSize: '500KB',
        maxFiles: 3,
    });


    let picurl = [];

    FilePond.setOptions({
        server: {
            process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append('file', file);
                const request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let picReqJson = JSON.parse(request.responseText);
                        picurl.push(picReqJson.link);
                        console.log(picurl)
                    }
                };
                request.upload.onprogress = (e) => {
                    progress(e.lengthComputable, e.loaded, e.total);
                };
                request.onload = function () {
                    if (request.status >= 200 && request.status < 300) {
                        // the load method accepts either a string (id) or an object
                        load(request.responseText);
                    } else {
                        // Can call the error method if something is wrong, should exit after
                        error('oh no');
                    }
                };
                let result = await request.open('POST', `${RabetApi}/api/admin/shop/upload_pro_img`,);
                request.send(formData);
            },
            revert: async (uniqueFileId, load, error) => {
                const request = new XMLHttpRequest();
                let picUrlDel = JSON.parse(uniqueFileId);
                let lastPoint = picUrlDel.link.lastIndexOf('.');
                let firtPoint = picUrlDel.link.lastIndexOf('/');
                let id = picUrlDel.link.slice(firtPoint + 1, lastPoint);
                let result = await request.open('DELETE', `${RabetApi}/api/user/pro_img/del/${id}`,);
                request.setRequestHeader('Auth-Token', localStorage.getItem('TK'))
                request.send();
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        picurl.splice(picurl.indexOf(picUrlDel.link), 1);
                    }
                };
                // Can call the error method if something is wrong, should exit after
                error('oh my goodness');
                // Should call the load method when done, no parameters required
                load();
            }
        }
    });

    $("#AddProductBtn").on("submit", (e) => {
        e.preventDefault();
        console.log(picurl)
        fetch(`${RabetApi}/api/admin/shop/add_product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Auth-Token': localStorage.getItem('token'),

            },
            body: JSON.stringify({
                title: $("#AddProductTitle").val(),
                subtitle: $("#AddProductSubTitle").val(),
                price: $("#AddProductPrice").val(),
                priceoff: $("#AddProductPriceOff").val(),
                details: $("#AddProductDis").val(),
                category: $('.select option:selected').val(),
                pics: picurl,
                priceagent: $('#AddProductPriceOff').val(),
                priceagentoff: $('#AddProductPriceagrntOff').val(),
            })

        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                if (result.status_code === 200) {
                    toast("با موفقیت ذخیره شد", "#11ff00");
                    setTimeout(() => {
                        window.location.href = "users.html";
                    }, 2000);
                } else {
                    toast("ثبت نشد", "#ff0000")
                }
            })
    })
}

if (Body.getAttribute('data-page') === 'category') {
    // get categories 
    const getCategories = () => {
        fetchApi('api/admin/shop/fetch_cat', { page: 1 })
            .then(res => {
                res.data.forEach(item => {
                    $('#category-select').append(`<option value="${item._id}" data-title="${item.title}" data-description="${item.dis}" data-img="${item.img}">${item.title}</option>`);
                });
            })
            .then(() => {
                changeCategoryImage();
            })

    };

    // submit category
    $('#category-form').on('submit', e => {
        e.preventDefault();
        fetchApi('api/admin/shop/add_cat', { title: $('#title').val() })
            .then(res => {
                if (res.status_code === 200) {
                    toast('دسته بندی با موفقیت افزوده شد', toastGreenColor);
                }
            })
    });

    // on load
    $(document).ready(() => {
        getCategories();
    });

    // edit category
    $('#edit-category').on('click', () => {
        const selectedOption = $('#category-select option:selected');
        $('#title').val(selectedOption.data('title'));
        $('#description').val(selectedOption.data('description'));
        $('#submit-market-cat').html('ثبت')
    })

    //delete category 
    $('#delete-category').on('click', () => {
        const selectedCategoryId = $('#category-select option:selected').val();

        fetchApi('api/admin/shop/del_cat', { id: selectedCategoryId })
            .then(res => {
                if (res.status_code === 200) {
                    toast('دسته بندی با موفقیت حذف شد', toastGreenColor);
                }
            })
    })
}

if (Body.getAttribute("data-paeg") === "ViewProduct") {

}


if (Body.getAttribute("data-page") === "DiscountCode") {
    const DiscountCodeShowontable = function (data) {
        radif = 1;
        result = "";

        data.forEach((item) => {

            result += `
            
               
            <tr>
                <td>${radif}</td>
                <td>${item.per}</td>
                <td>${item.code}</td>
                <td>${item.dateTime_add.slice(0, 11)}</td>
                <td>${item.date}</td>

                <td>
                    <div class="table-action-buttons">
                        <a class="delete button button-box button-xs button-danger" href="#"><i class="zmdi zmdi-delete delete-discount" id="61e57723c18f84dd83c4b3c3"></i></a>
                    </div>
                </td>
            </tr>
            `;
            radif++;
        })
        $("#discount-table").html(result);
    }
    const DiscountCodeFetch = function () {
        fetch(`https://elpino-api.liara.run/api/discode/fetch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            },
            body: JSON.stringify({
                number: 500,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                DiscountCodeShowontable(result.data);
            })

    }



    $("#discount-submit").on("click", () => {
        fetch(`https://elpino.liara.run/api/discode/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            },
            body: JSON.stringify({
                code: $("#discount-code").val(),
                date: $("#discount-percent").val(),
                per: $("#datePicker").val(),
            })
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
            })
    })



    $(document).ready(function () {
        DiscountCodeFetch();
    })


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

    // date picker
    $(document).ready(function () {
        $('#datePicker').persianDatepicker({
            observer: true,
            initialValue: false,
            viewMode: 'year',
            format: 'YYYY/MM/DD',
            altField: '.insurance_form_name-alt'
        });
    });






}


if (Body.getAttribute("data-page") === "Orders") {

    const Showproductintable = function (data) {
        let radif = 1;
        let result = "";
        data.forEach((item) => {
            console.log(item);
            result += `
            <tr>
      <td>${radif}</td>
      <td>${item.username}</td>
      <td>${item.phone_number}</td>
      <td>${item.dateTime.slice(0, 16).split(" ").join("&nbsp;|&nbsp;")}</td>
      <td>${item.product_list.length}</td>
      <td>${item.localid}</td>
      <td>${item.address}</td>
      <td class="d-flex justify-content-center">
              <button class="Edite-advertise button button-box button-xs button-primary ml-2 mr-2" id=${item._id}>
              <i class="Edite-advertise zmdi fa fa-pencil-square-o" id=${item._id}></i>
          </button>
          <button class="reject-adver remove button button-box button-xs button-danger">
              <i class="reject-adver fa fa-trash-o"></i>
          </button>
      </td>
  </tr>
            `;
            radif++;
        })
        $("#users-table").html(result)

    }

    const getUserFromServer = function () {
        fetch('https://elpino-api.liara.run/api/admin/shop/fetch_order', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            },
            body: JSON.stringify({
                type: "shop",
                page: "1",
            })
        })
            .then((respone) => respone.json())
            .then((result) => {
                Showproductintable(result.data)
            })

    }

    getUserFromServer();

    document.getElementById("searchBtn").addEventListener("click", () => {
        fetch(`https://elpino-api.liara.run/api/admin/shop/fetch_order_search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            },
            body: JSON.stringify({
                data: $("#dataSearch").val(),
                type: "shop",
                page: 1,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                $("#users-table").html("")
                Showproductintable(result.data)
            })
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


    const settingsedualtfetch = function () {
        fetch(`https://elpino-api.liara.run/api/admin/seting/fetch`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            },
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                $("#admin-username").val(result.admin[0].user)
                $("#admin-password").val(result.admin[0].pass)

            })
    }


    const Settingsadminfetch = function () {
        fetch(`https://elpino.liara.run/api/admin/seting/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Auth-Token": "YTUEdfsdfsdRBbbb2tr2hrthRT2rth!BbBg@@)(999+_+_+)!NBVHGF",
            },
            body: JSON.stringify({
                user: $("#admin-username").val(),
                pass: $("#admin-password").val(),
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status_code === 200) {
                    toast();
                    setTimeout(() => {
                        window.location.href = "users.html";
                    }, 2000);
                }
            })
    }
    $(".btn ").on("click", () => {
        Settingsadminfetch()
    })

    $(document).ready(function () {
        settingsedualtfetch()
    })

}

if (Body.getAttribute("QRCode") === "QRCode") {




    function showontable(result) {

    }

    const getfromserver = fetch(``, {
        method: "",
        headers: {

        },
        body: JSON.stringify({

        })
    }).then((response) => response.json)
        .then((result) => {
            showontable(result);
        })

    getfromserver()
}

$('#log-out').click(function () {
    localStorage.clear();
});