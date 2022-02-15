const RabetApi = `https://rabetettehad.herokuapp.com/`
const Body = document.querySelector("body");

// const spinner = new jQuerySpinner({
//     parentId: 'spiner',
//     duration: 1000
//     //     spinner.show();
//     //     spinner.hide();
// });


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
        onClick: function () {} // Callback after click
    }).showToast();

}

const sliceNumber = function (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

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
            await fetch(`${RabetApi}${url}`, {
                method: 'GET',
                headers: {
                    'Auth-Token': localStorage.getItem('token')
                },
            })
                .then(respone => respone.json())
                .then(result => {
                    lastResult = result
                })
                .catch(err => toast(err, '#b90000'))
        }

    } catch (err) {
        toast(err, '#b90000');
        lastResult = err;
    };
    return lastResult;
};

// ========== login page ==========
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
// ========== Dashboard page ==========
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
// ========== Users page ==========
if (Body.getAttribute("data-page") === "Users") {
    spinner.show();
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
                spinner.hide();
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
// ========== User page ==========
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
// ========== Products page ==========
if (Body.getAttribute("data-page") === "Products") {
    let page = 1;
    let productCount = 0;
    let categoryFilter = 'all';

    // fetch to get Products
    const getProducts = () => {

        fetchApi('api/admin/shop/fetch_products', {
                page,
                cat: categoryFilter
            })
            .then(data => {
                if (data.status_code === 200) {
                    productCount = data.product_count;
                    showProductTable(data);
                }
                return data;
            })
            .then(data => {
                // delete product
                $('.delete-product').click(function (e) {
                    e.preventDefault();
                    fetchApi('api/admin/shop/del_product', {
                            id: e.target.id
                        })
                        .then(res => {
                            if (res.status_code === 200) {
                                toast('محصول با موفقیت حذف شد', toastGreenColor);
                                getProducts();
                            } else if (res.status_code === 402) {
                                toast(res.description_fa, toastRedColor);
                            };
                        });
                });
            })
        // pagination control
        // .then(() => {
        //     (function (containerID, productCount) {
        //         var container = $(`#${containerID}`);
        //         var sources = function () {
        //             var result = [];
        //             for (var i = 1; i < productCount; i++) {
        //                 result.push(i);
        //             }
        //             return result;
        //         }();
        //         var options = {
        //             dataSource: sources,
        //             showGoInput: true,
        //             showGoButton: true,
        //             goButtonText: 'برو',
        //             pageSize: 12,
        //             pageNumber: page,
        //             prevText: '&raquo;',
        //             nextText: '&laquo;',
        //             callback: function (response, pagination) {
        //                 var dataHtml = '<ul>';
        //                 $.each(response, function (index, item) {
        //                     dataHtml += '<li>' + item + '</li>';
        //                 });
        //                 dataHtml += '</ul>';
        //                 container.prev().html(dataHtml);
        //             }
        //         };
        //         container.pagination(options);
        //         container.addHook('afterPageOnClick', (response, pagination) => {
        //             loaderIn();
        //             page = parseInt(pagination);
        //             localStorage.setItem('page', page);
        //             getProducts();
        //         })
        //         container.addHook('afterGoButtonOnClick', (response, pagination) => {
        //             loaderIn();
        //             page = parseInt(pagination);
        //             localStorage.setItem('page', page);
        //             getProducts();
        //         })
        //         container.addHook('afterPreviousOnClick', (response, pagination) => {
        //             loaderIn();
        //             page = parseInt(pagination);
        //             localStorage.setItem('page', page);
        //             getProducts();
        //         })
        //         container.addHook('afterNextOnClick', (response, pagination) => {
        //             loaderIn();
        //             page = parseInt(pagination);
        //             localStorage.setItem('page', page);
        //             getProducts();
        //         })

        //     })('pagination', productCount);
        // })
    }
    // show Products on Table
    const showProductTable = function (data) {
        let result = '';
        data.data.forEach((item, idx) => {
            result +=
                `
            <tr>
                <td>${idx + 1}</td>
                <td><img src="${item.pics[0]}" alt="" width="100" class="product-image"></td>
                <td>${item.title}</td>
                <td>${item.subtitle}</td>
                <td>${item.isSpecial ? 'بله' : 'خیر'}</td>
                <td>${sliceNumber(item.price)}</td>
                <td>${sliceNumber(item.priceoff)}</td>
                <td>${sliceNumber(item.priceagent)}</td>
                <td>${sliceNumber(item.priceagentoff)}</td>
                <td>${item.sell_count}</td>
                <td style="color: ${item.status ? 'green' : 'red'}">${item.status ? 'فعال' : 'غیرفعال'}</td>
                <td>
                    <div class="table-action-buttons">
                        <a class="edit button button-box button-xs button-info" href="Product.html?${item._id}">
                            <i class="zmdi zmdi-edit show-product" id="${item._id}"></i>
                        </a>
                        <button class="delete button button-box button-xs button-danger delete-product" id="${item._id}">
                            <i class="zmdi zmdi-delete" id="${item._id}"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
            $('#Products-table').html(result)
        });
    };
    // get categories 
    const getCategories = () => {
        fetchApi('api/admin/shop/fetch_cat', {
                page: 1
            })
            .then(res => {
                res.data.forEach(item => {
                    $('#categories').append(`<option value="${item._id}" data-title="${item.title}" data-description="${item.dis}" data-img="${item.img}">${item.title}</option>`);
                });
            })

    };
    // page load
    $(document).ready(() => {
        getProducts();
        getCategories();
    })
    // get products by category filter
    $('#categories').on('change', () => {
        $('#Products-table').html('');
        categoryFilter = $('#categories option:selected').val();
        getProducts();
    })
    // search product
    $('#search-form').on('submit', (e) => {
        // loaderIn();
        e.preventDefault();
        $('#Products-table').html('');
        fetchApi(`api/admin/shop/search_product`, {
                data: $('#search-text').val()
            })
            .then(data => {
                if (data.status_code == 200) {
                    showProductTable(data);
                };
            })
            .then(() => {
                // delete product
                $('.delete-product').click(function (e) {
                    e.preventDefault();
                    fetchApi('api/admin/shop/del_product', {
                            id: e.target.id
                        })
                        .then(res => {
                            if (res.status_code === 200) {
                                toast('محصول با موفقیت حذف شد', toastGreenColor);
                                getProducts();
                            } else if (res.status_code === 402) {
                                toast(res.description_fa, toastRedColor);
                            };
                        });
                });
            })
    });
    // cancel search 
    $('#search-form').on('reset', () => {
        page = 1;
        $('#Products-table').html('');
        getProducts();
    })
}
// ========== Product page ==========
if (Body.getAttribute("data-page") === "Product") {

    const productID = document.URL.split('?')[1];

    FilePond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,
        FilePondPluginImageValidateSize, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);
    const createFilePond = count => {
        FilePond.create($('#file-pond')[0], {
            imagePreviewHeight: 140,
            imageValidateSizeMaxWidth: 500,
            imageValidateSizeMaxHeight: 500,
            imageValidateSizeLabelExpectedMaxSize: 'سایز عکس ها تا 500 * 500',
            acceptedFileTypes: ['image/png'],
            maxFileSize: '500KB',
            maxFiles: count,
        });
    }



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
                request.open('POST', `${RabetApi}api/admin/shop/upload_pro_img`, );
                request.send(formData);
            },
            revert: async (uniqueFileId, load, error) => {
                const request = new XMLHttpRequest();
                let picUrlDel = JSON.parse(uniqueFileId);
                let lastPoint = picUrlDel.link.lastIndexOf('.');
                let firtPoint = picUrlDel.link.lastIndexOf('/');
                let id = picUrlDel.link.slice(firtPoint + 1, lastPoint);
                let result = await request.open('DELETE', `${RabetApi}/api/user/pro_img/del/${id}`,);
                request.setRequestHeader('Auth-Token', localStorage.getItem('token'))
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

    // get categories 
    const getCategories = async () => {
        await fetchApi('api/admin/shop/fetch_cat', {
                page: 1
            })
            .then(res => {
                res.data.forEach(item => {
                    $('#categories').append(`<option value="${item._id}">${item.title}</option>`);
                });
            })
    };
    // render uploaded images
    const renderUploadedImages = () => {
        picurl.map(item => {
            $('#uploaded-images').append(
                `<img src="${item}" class="uploaded-image" id="${item.split('/').slice(-1)[0]}" style="margin: 0 10px;" width="140" alt="">`
            );
        })
    }
    // page load
    $(document).ready(() => {
        if (productID) {
            fetchApi(`api/admin/shop/fetch_one_product`, {
                    id: productID
                })
                .then(data => {
                    $('#status-select').css({
                        display: ''
                    });
                    data = data.data[0];
                    $("#ProductTitle").val(data.title);
                    $("#ProductSubTitle").val(data.subtitle);
                    $("#ProductPrice").val(data.price);
                    $("#ProductPriceOff").val(data.priceoff);
                    $("#ProductDis").val(data.details);
                    $('#categories option:selected').val(data.category);
                    $('#ProductPriceOff').val(data.priceoff);
                    $('#ProductPriceagrntOff').val(data.priceagentoff);
                    $('#ProductPriceagrnt').val(data.priceagent);

                    $('#Producttotal').val(data.Producttotal);
                    $('#special-offer').prop('checked', data.isSpecial);
                    picurl = [...data.pics];

                    renderUploadedImages();
                    createFilePond(3 - picurl.length);

                    $($('#status-select option')[data.status ? 0 : 1]).prop('selected', true)

                    return data
                })
                .then(async (data) => {
                    await getCategories();
                    [...$('#categories option')].map(item => {
                        if ($(item).val() === data.category) {
                            $(item).prop('selected', true);
                        }
                    })
                })
                .then(() => {
                    $('.uploaded-image').on('click', e => {
                        picurl.map(item => {
                            if (item.split('/').slice(-1)[0] === e.target.id) {
                                picurl.splice(picurl.indexOf(item), 1);
                                $(e.target).remove();
                                renderUploadedImages();
                                $('#file-pond').remove();
                                $('#file-pond-container').append(`<input id="file-pond" type="file" multiple>`)
                                createFilePond(3 - picurl.length);
                            }
                        })
                    })
                })
        } else {
            getCategories();
            createFilePond(3);
        };
    });

    $("#product-form").on("submit", (e) => {
        e.preventDefault();

        if (productID) {
            const body = {
                title: $("#ProductTitle").val(),
                subtitle: $("#ProductSubTitle").val(),
                price: parseInt($("#ProductPrice").val()),
                priceoff: parseInt($("#ProductPriceOff").val()),
                details: $("#ProductDis").val(),
                category: $('#categories option:selected').val(),
                pics: picurl,
                priceagent: parseInt($('#ProductPriceOff').val()),
                priceagentoff: parseInt($('#ProductPriceagrntOff').val()),
                Producttotal: $('#Producttotal').val(),
                isSpecial: $('#special-offer').prop('checked'),
                status: $('#status-select option:selected').val() === 'true' ? true : false,
                product_id: productID,
            };
            console.log(body)
            fetchApi('api/admin/shop/update_product', body)
                .then((res) => {
                    console.log(res);
                    if (res.status_code === 200) {
                        toast("با موفقیت ثبت شد", toastGreenColor);
                        setTimeout(() => {
                            // window.location.href = "users.html";
                        }, 2000);
                    } else if (res.status_code === 402) {
                        toast(res.description_fa, toastRedColor);
                    }
                })
        } else {
            const body = {
                title: $("#ProductTitle").val(),
                subtitle: $("#ProductSubTitle").val(),
                price: parseInt($("#ProductPrice").val()),
                priceoff: parseInt($("#ProductPriceOff").val()),
                details: $("#ProductDis").val(),
                category: $('#categories option:selected').val(),
                pics: picurl,
                priceagent: parseInt($('#ProductPriceOff').val()),
                priceagentoff: parseInt($('#ProductPriceagrntOff').val()),
                Producttotal: $('#Producttotal').val(),
                isSpecial: $('#special-offer').prop('checked'),
            };
            console.log(body)
            fetchApi('api/admin/shop/add_product', body)
                .then((res) => {
                    console.log(res);
                    if (res.status_code === 200) {
                        toast("با موفقیت ثبت شد", toastGreenColor);
                        setTimeout(() => {
                            // window.location.href = "users.html";
                        }, 2000);
                    } else if (res.status_code === 402) {
                        toast(res.description_fa, toastRedColor);
                    }
                })
        }
    })
}
// ========== category page ==========
if (Body.getAttribute('data-page') === 'category') {
    // get categories 
    const getCategories = () => {
        fetchApi('api/admin/shop/fetch_cat', {
                page: 1
            })
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
        fetchApi('api/admin/shop/add_cat', {
                title: $('#title').val()
            })
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

        fetchApi('api/admin/shop/del_cat', {
                id: selectedCategoryId
            })
            .then(res => {
                if (res.status_code === 200) {
                    toast('دسته بندی با موفقیت حذف شد', toastGreenColor);
                }
            })
    })
}
// ========== Sliders page ==========
if (Body.getAttribute('data-page') === 'Sliders') {

    const showSlidersOnTable = function (data) {
        let result = "";
        let radif = 1;
        data.forEach((item) => {
            result += `
        <tr>
            <td>${radif}</td>
            <td><img src="${item.mobile_img}" alt="" width="100" height="100" class="product-image"></td>
            <td><img src="${item.site_img}" alt="" width="100" height="100" class="product-image"></td>
            <td>${item.url}</td>
            <td class="d-flex justify-content-center">
                <button id="${item._id}" class="delete-slider remove button button-box button-xs button-danger">
                    <i class="delete-slider fa fa-trash-o" id="${item._id}"></i>
                </button>
            </td>
        </tr>

      `;
            radif++;
        });
        document.getElementById("sliders-table").innerHTML = result;
    };

    const getSlidersFromServer = () => {
        fetchApi('api/slider/admin/fetch_slider')
            .then(res => {
                showSlidersOnTable(res.data);
                console.log(res)
            })
            .then(() => {
                $('.delete-slider').on('click', e => {
                    fetchApi('api/slider/admin/delet_slider', { id: e.target.id })
                        .then(res => {
                            if (res.status_code === 200) {
                                toast('اسلایدر با موفقیت افزوده شد', toastGreenColor);
                                getSlidersFromServer();
                            } else if (res.status_code === 402) {
                                toast(res.description_fa, toastRedColor);
                            };
                        })
                })
            })
    };

    getSlidersFromServer();
}
// ========== Slider page ==========
if (Body.getAttribute('data-page') === 'Slider') {

    let mobileSlider = 'https://www.seoptimer.com/blog/wp-content/uploads/2020/05/website-header-size.png';
    let webSlider = 'https://static.vecteezy.com/system/resources/thumbnails/002/294/181/small/welcome-to-university-web-banner-design-free-vector.jpg';

    const MobileSliderPond = FilePond;
    const WebSliderPond = FilePond;

    MobileSliderPond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,
        FilePondPluginImageValidateSize, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);
    WebSliderPond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,
        FilePondPluginImageValidateSize, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

    MobileSliderPond.create($('#mobile-slider-file-pond')[0], {
        imagePreviewHeight: 140,
        imageValidateSizeMaxWidth: 500,
        imageValidateSizeMaxHeight: 500,
        imageValidateSizeLabelExpectedMaxSize: 'سایز عکس ها تا 500 * 500',
        acceptedFileTypes: ['image/png', 'image/jpeg'],
        maxFileSize: '500KB',
    });
    WebSliderPond.create($('#web-slider-file-pond')[0], {
        imagePreviewHeight: 140,
        imageValidateSizeMaxWidth: 500,
        imageValidateSizeMaxHeight: 500,
        imageValidateSizeLabelExpectedMaxSize: 'سایز عکس ها تا 500 * 500',
        acceptedFileTypes: ['image/png'],
        maxFileSize: '500KB',
    });

    MobileSliderPond.setOptions({
        server: {
            process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append('file', file);
                const request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let picReqJson = JSON.parse(request.responseText);
                        console.log(request.responseText)
                        mobileSlider = picReqJson.link;
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
                // request.setRequestHeader('Auth-Token', localStorage.getItem('token'))
                request.open('POST', `${RabetApi}api/admin/fileUpload/d=page`, true);
                request.send(formData);
            },
            revert: async (uniqueFileId, load, error) => {
                const request = new XMLHttpRequest();
                let picUrlDel = JSON.parse(uniqueFileId);
                let lastPoint = picUrlDel.link.lastIndexOf('.');
                let firtPoint = picUrlDel.link.lastIndexOf('/');
                let id = picUrlDel.link.slice(firtPoint + 1, lastPoint);
                let result = await request.open('DELETE', `${RabetApi}/api/user/pro_img/del/${id}`,);
                request.setRequestHeader('Auth-Token', localStorage.getItem('token'))
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
    WebSliderPond.setOptions({
        server: {
            process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append('file', file);
                const request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let picReqJson = JSON.parse(request.responseText);
                        console.log(request.responseText)
                        webSlider = picReqJson.link;

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
                request.open('POST', `${RabetApi}api/admin/fileUpload/d=page`, true);
                request.send(formData);
            },
            revert: async (uniqueFileId, load, error) => {
                const request = new XMLHttpRequest();
                let picUrlDel = JSON.parse(uniqueFileId);
                let lastPoint = picUrlDel.link.lastIndexOf('.');
                let firtPoint = picUrlDel.link.lastIndexOf('/');
                let id = picUrlDel.link.slice(firtPoint + 1, lastPoint);
                let result = await request.open('DELETE', `${RabetApi}/api/user/pro_img/del/${id}`,);
                request.setRequestHeader('Auth-Token', localStorage.getItem('token'))
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

    $('#slider-form').on('submit', e => {
        e.preventDefault();
        console.log(mobileSlider, webSlider)

        if (mobileSlider && webSlider) {
            const body = {
                title: $('#title').val(),
                url: $('#url').val(),
                site_img: webSlider,
                mobile_img: mobileSlider,
            };
            fetchApi('api/slider/admin/add_slider', body)
                .then(res => {
                    if (res.status_code === 200) {
                        toast('اسلایدر با موفقیت افزوده شد', toastGreenColor);
                        setTimeout(() => {
                            window.location.href = 'Sliders.html';
                        }, 2000);
                    }
                })

        } else {
            toast('عکس های اسلایدر الزامی می باشد', toastRedColor);
        };
    });
};
// ========== category page ==========
if (Body.getAttribute('data-page') === 'About') {
    const editor = new EditorJS({
        holder: 'editor',
        tunes: ['anyTuneName'],
        tools: {
            raw: RawTool,

            header: {

                class: Header,
                config: {
                    placeholder: 'Enter a header',
                    levels: [2, 3, 4],
                    defaultLevel: 3
                },
            },
            image: {
                class: ImageTool,
                config: {
                    /**
                     * Custom uploader
                     */
                    uploader: {
                        /**
                         * Upload file to the server and return an uploaded image data
                         * @param {File} file - file selected from the device or pasted by drag-n-drop
                         * @return {Promise.<{success, file: {url}}>}
                         */
                        async uploadByFile(file) {
                            let link;
                            const formData = new FormData();
                            formData.append('file', file);


                            const request = await fetch(`${RabetApi}api/admin/fileUpload/d=page`, {
                                method: 'POST',
                                body: formData,
                            })
                            const res = await request.json();
                            console.log(res)

                            return {
                                success: 1,
                                file: {
                                    url: res.URL,
                                }
                            }
                        },
                    }
                }
            },
            Color: {
                class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
                config: {
                    colorCollections: ['#000000', '#FF1300', '#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'],
                    defaultColor: '#FF1300',
                    type: 'text',
                }
            },
            Marker: {
                class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
                config: {
                    defaultColor: '#FFBF00',
                    type: 'marker',
                }
            },
            anyTuneName: {

                class: AlignmentBlockTune,
                config: {
                    default: "right",
                    blocks: {
                        header: 'center',
                        list: 'right'
                    }
                },
            },
            list: {
                class: List,
                inlineToolbar: true,
            },
        }
    });

    const convertDataToHtml = (blocks) => {
        console.log(blocks)
        var convertedHtml = "";
        blocks.map(block => {

            switch (block.type) {
                case "header":
                    convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                    break;
                case "embded":
                    convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
                    break;
                case "paragraph":
                    convertedHtml += `<p>${block.data.text}</p>`;
                    break;
                case "delimiter":
                    convertedHtml += "<hr />";
                    break;
                case "raw":
                    convertedHtml += block.data.html
                    break;
                case "image":
                    convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                    break;
                case "list":
                    convertedHtml += "<ul>";
                    block.data.items.forEach(function (li) {
                        convertedHtml += `<li>${li}</li>`;
                    });
                    convertedHtml += "</ul>";
                    break;
                default:
                    console.log("Unknown block type", block.type);
                    break;
            }
        });
        return convertedHtml;
    }

    $('#submit-editor').on('click', () => {
        editor.save().then((outputData) => {
            console.log('Article data: ', convertDataToHtml(outputData.blocks))
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    });
}
// ========== DiscountCode page ==========
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
// ========== Orders page ==========
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
// ========== Settings page ==========
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
// ========== QRCode page ==========
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
// ========== Representatives ==========
if (Body.getAttribute("data-page") === "Representatives") {
    // =====================================accepted agent==========================================
    spinner.show();
    var usersCount;
    var page = 1;
    const showontable = function showontable(data) {
        radif = 1;
        result = "";
        data.forEach((item) => {
            result += `
            <tr>
                <td>${radif}</td>
                <td>${item.name}</td>
                <td>${item.mobile}</td>
                <td>${item.tell}</td>
                <td>${item.dateTime.slice(0, 16).split(" ").join("&nbsp;|&nbsp;")}</td>
                <td >
                    <button class="show-agent button button-box button-xs button-primary ml-2 mr-2" id=${item._id}>
                        <i class="show-agent fa fa-eye" id=${item._id}></i>
                    </a>
                </td>
            </tr>
            `;
            radif++;
        })
        document.getElementById("table-show").innerHTML = result;
    }
    // accepted
    const getfromserver = function () {
        fetch(`${RabetApi}/api/agent/admin/fetch_agent`, {
            method: "POST",
            headers: {
                'Auth-Token': localStorage.getItem('token'),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                number: page,
            })
        })
            .then((response => response.json()))
            .then((result => {
                spinner.hide();
                console.log(result, "تایید شده");
                showontable(result.data);
                usersCount = result.agent_count;
            }))
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
                        getfromserver();
                    });
                    container.addHook("afterGoButtonOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        getfromserver();
                    });
                    container.addHook("afterPreviousOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        getfromserver();
                    });
                    container.addHook("afterNextOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        getfromserver();
                    });
                })("pagination", usersCount);
            })
            .then(() => {
                $('.show-agent').on("click", (e) => {
                    window.location.href = `Representative.html?${e.target.id}`
                })
            })
    }
    getfromserver();
    // shearch result
    const Showsearchtable = function (data) {
        let result = "";
        let radif = 1;
        data.forEach((item) => {
            result += `
            <tr>
            <td>${radif}</td>
            <td>${item.name}</td>
            <td>${item.mobile}</td>
            <td>${item.tell}</td>
            <td>${item.dateTime.slice(0, 16).split(" ").join("&nbsp;|&nbsp;")}</td>
            <td >
                <button class="show-agent button button-box button-xs button-primary ml-2 mr-2" id=${item._id}>
                    <i class="show-agent fa fa-eye" id=${item._id}></i>
                </a>
            </td>
        </tr>
            `;
        })
        document.getElementById("table-show").innerHTML = result;
    }
    // serach
    $("#searchBtn").click((e) => {
        let mobileNum = $("#mobilenum").val()
        $("#table-show").html("");
        $("#pagination").html("");
        fetch(`${RabetApi}`, {
            method: "GET",
            headers: {
                'Auth-Token': localStorage.getItem('token'),
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                Showsearchtable(result.data)
            })
            .then(() => {
                $('.show-agent').on("click", (e) => {
                    window.location.href = `Representative.html?${e.target.id}`
                })
            })
    })
    $("#reloadtable").click(() => {
        window.location.reload();
    })
    // ======================================inpross agent=========================================
    // table-show-inprossess
    const inprossessshowontable = function (data) {
        radif = 1;
        result = "";
        data.forEach((item) => {
            result += `
            <tr>
                <td>${radif}</td>
                <td>${item.name}</td>
                <td>${item.mobile}</td>
                <td>${item.tell}</td>
                <td>${item.dateTime.slice(0, 16).split(" ").join("&nbsp;|&nbsp;")}</td>
                <td >
                    <button onclick="access(this)" class="show-access button button-box button-xs button-success ml-2 mr-2" id=${item._id}>
                        <i class="show-accessfa fa fa-check" id=${item._id}></i>
                    </button>
                    <button onclick="reject(this)" class="show-reject button button-box button-xs button-danger ml-2 mr-2" id=${item._id}>
                        <i class="show-reject fa fa-times" id=${item._id}></i>
                    </button>
                </td>
            </tr>
            `;
            radif++;
        })
        document.getElementById("table-show-inprossess").innerHTML = result;
    }
    // get server inprosess
    const inprossessgetfromserver = function () {
        let usersCount;
        let page = 1;
        fetch(`${RabetApi}/api/agent/admin/fetch_agent_inprossess`, {
                method: "POST",
                headers: {
                    'Auth-Token': localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    number: page,
                })
            })
            .then((response => response.json()))
            .then((result => {
                spinner.hide();
                console.log(result, "inprossess");
                inprossessshowontable(result.data);
                usersCount = result.agent_count;
            }))
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
                        inprossessgetfromserver();
                    });
                    container.addHook("afterGoButtonOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        inprossessgetfromserver();
                    });
                    container.addHook("afterPreviousOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        inprossessgetfromserver();
                    });
                    container.addHook("afterNextOnClick", (response, pagination) => {
                        page = parseInt(pagination);
                        inprossessgetfromserver();
                    });
                })("paginationinprossess", usersCount);
            })
            .then(() => {
                $('.show-agent').on("click", (e) => {
                    window.location.href = `Representative.html?${e.target.id}`
                })
            })
    }
    inprossessgetfromserver()
    //  reject
    function reject(e) {
        let userID = e.id;
        fetch(`${RabetApi}api/agent/admin/delet_agent`, {
                method: 'POST',
                headers: {
                    'Auth-Token': localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: userID,
                })
            }).then((response) => response.json())
            .then((result) => {
                console.log(result);
                if (result.status_code === 200) {
                    window.location.reload();
                } 
            })
    }
    // access
    function access(e) {
        console.log(e.id);
        let userID = e.id;
        fetch(`${RabetApi}api/agent/admin/accept_agent`, {
                method: 'POST',
                headers: {
                    'Auth-Token': localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idz: userID,
                })
            }).then((response) => response.json())
            .then((result) => {
                if (result.status_code === 200) {
                    window.location.reload();
                }
            })
    }

}

// ========== Representative ==========
if (Body.getAttribute("data-page") === "Representative") {

    let userId = document.URL.split('?')[1]

    const ShowOnRepresentative = function (data) {
        console.log(data);
        $("#address").html(data.address)
        $("#birthday").html(data.birthday)
        $("#certificate").html(data.certificate)
        $("#city").html(data.city)
        $("#description").html(data.description)
        $("#education").html(data.education)
        $("#email").html(data.email)
        $("#fatherName").html(data.fatherName)
        $("#meliCode").html(data.meliCode)
        $("#mobile").html(data.mobile)
        $("#money").html(data.money)
        $("#name").html(data.name)
        $("#score").html(data.score)
        $("#shopAddress").html(data.shopAddress)
        $("#shopArea").html(data.shopArea)
        $("#shopType").html(data.shopType)
        $("#state").html(data.state)
        $("#tell").html(data.tell)
        $("#shopAddress").html(data.shopAddress)

    }

    const getfromserver = function () {
        fetch(`${RabetApi}/api/agent/admin/fetch_one`, {
                method: "POST",
                headers: {
                    'Auth-Token': localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: userId,
                })
            })
            .then((response) => response.json())
            .then((result) => {
                ShowOnRepresentative(result.data)
            })
    }
    getfromserver();
}

$('#log-out').click(function () {
    localStorage.clear();
});