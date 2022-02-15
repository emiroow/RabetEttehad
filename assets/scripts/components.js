const menu = `
<ul>
<li><a href="Dashboard.html"><i class="fa fa-tachometer"></i> <span >داشبورد</span></a></li>
<li><a href="Users.html"><i class="fa fa-user-o"></i> <span>کاربران</span></a></li>
<li class="has-sub-menu"><a ><i class="fa fa-shopping-bag"></i> <span>فروشگاه</span></a>
<ul class="side-header-sub-menu">
<li><a href="Product.html"><i class="fa fa-plus"></i> <span>افزودن محصول</span></a>
<li><a href="Products.html"><i class="fa fa-shopping-basket"></i> <span>مشاهده محصولات </span></a>
<li><a href="category.html"><i class="fa fa-building-o"></i> <span> دسته بندی </span></a>
</ul>
</li>
<li><a href="LotteryCode.html"><i class="fa fa-gavel"></i> <span>کد های ارسالی ( قرعه کشی )</span></a></li>
<li><a href="Orders.html"><i class="fa fa-shopping-basket"></i> <span>سفارشات</span></a></li>
<li><a href="DiscountCode.html"><i class="fa fa-ticket"></i> <span>کد تخفیف</span></a></li>
<li><a href="Representatives.html"><i class="fa fa-user-circle-o"></i> <span> نمایندگان </span></a></li>

<li class="has-sub-menu"><a ><i class="fa fa-pencil-square-o"></i> <span> اسلایدر ها </span></a>
    <ul class="side-header-sub-menu">
        <li><a href="Sliders.html"><i class="fa fa-laptop"></i> <span> اسلایدر ها </span></a>
        <li><a href="Slider.html"><i class="fa fa-mobile"></i> <span> تعریف اسلایدر </span></a>
    </ul>
</li>

<li><a href="QRcode.html"><i class="fa fa-shopping-basket"></i> <span>QR کد</span></a></li>

<li><a href="Settings.html"><i class="fa fa-sun-o"></i> <span>تنظیمات</span></a></li>

<li class="has-sub-menu"><a ><i class="fa fa-window-maximize"></i> <span>صفحات</span></a>
<ul class="side-header-sub-menu">
<li><a href="About.html"><i class="fa fa-weixin"></i> <span>درباره ما</span></a>
</ul>

<li id="log-out" ><a href="index.html"><i class="fa fa-sign-out"></i> <span>خروج</span></a></li>
</ul>
`;
document.getElementById("side-header-menu").innerHTML = menu;



$('#log-out').click(function() {
    localStorage.clear();
});