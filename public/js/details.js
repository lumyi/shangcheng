$(function () {
    if (location.search !== "") {
        // 获得地址栏中商品编号lid
        var lid = location.search.split("=")[1];
        $.ajax({//向服务端发送请求
            url: "http://localhost:3000/details",
            type: "get",
            data: { lid },//{lid:lid}用lid做查询参数
            dataType: "json",
            success(result) {//得到服务端返回的当前商品的详细信息
                console.log(result);
                //解构
                var { product, specs, pics } = result;

                /*****************基本信息********************/
                $("#details").children().first()//第一个h6
                    .html(product.title)
                    .next()//第二个h6
                    .html(`<a class="small text-dark font-weight-bold" href="javascript:;">${product.subtitle}</a>`)
                    .next()//第一个div
                    .find("div>h2")//第一个子div下的h2
                    .html(`¥${product.price}`)
                    .parent().next().last()//第二个子div下的最后一个span
                    .html(product.promise);

                /******************规格信息*********************/
                var html = "";
                for (var spec of specs) {
                    html += `<a class="btn btn-sm btn-outline-secondary ${spec.lid == lid ? "active" : ""}" href="product_details.html?lid=${spec.lid}" class="active">${spec.spec}</a>`
                }
                $("#details>div:eq(1)>div:eq(1)").html(html);

                /******************放大镜效果******************/
                // 1.把小图片放到li中
                var html = "";
                for (var pic of pics) {
                    html += `<li class="float-left p-1">
                    <img src="${pic.sm}" data-md="${pic.md}" data-lg="${pic.lg}">
                  </li>`
                };
                var $ul = $("#div-lg").next().find("div>ul");
                $ul.html(html).css({ width: 62 * pics.length });
                // 放第一张小图片的md
                var $mdImg=$("#div-lg").siblings("img:first");
                $mdImg.attr({ src: pics[0].md });
                // 放第一张小图片的lg
                $("#div-lg").css({ backgroundImage: `url(${pics[0].lg})` })
                // 2.左右按钮
                var $btnLeft = $("#div-lg").next().children("img:first");
                var $btnRight = $btnLeft.next().next();
                // 点击按钮移动
                // 如果小图片小于4张，右边按钮.disabled
                if (pics.length < 4) {
                    $btnRight.addClass("disabled");
                };
                var moved = 0;
                $btnLeft.click(function () {
                    // 如果按钮没有.disabled，就能点击
                    if ($(this).is(":not(.disabled)")) {
                        moved--;
                        $ul.css({ marginLeft: -62 * moved });
                        // 如果moved==0，说明左边到头，禁用左按钮
                        if(moved==0){
                            $(this).addClass("disabled");
                        }
                    }

                });
                $btnRight.click(function () {
                    // 如果按钮没有.disabled，就能点击
                    if ($(this).is(":not(.disabled)")) {
                        moved++;
                        $ul.css({ marginLeft: -62 * moved });
                        // 右按钮点击，启用左按钮
                        $btnLeft.removeClass("disabled");
                        // 如果moved+4==pics.length,说明右边到头，禁用右按钮
                        if(moved+4==pics.length){
                            $(this).addClass("disabled");
                        }
                    }
                });
                // 3.鼠标进入更换中图片和大图片
                // 利用冒泡 
                $ul.on("mouseenter","li>img",function(){
                    // 获得当前小图片
                    var $img=$(this);
                    // 找到当前中图片路径
                    var src=$img.attr("data-md");
                    // 放入中图片
                    $mdImg.attr({src});
                    // 找到当前大图片路径
                    var backgroundImage=`url(${$img.attr("data-lg")})`;
                    // 放入大图片
                    $("#div-lg").css({backgroundImage});
                })
                // 4.鼠标进入，显示遮挡层和大图片
                //   鼠标移出，隐藏遮挡层和大图片
                var $mask=$("#mask");
                var $smask=$("#super-mask");
                /*$smask.mouseenter(function(){
                    $mask.removeClass("d-none");
                    $("#div-lg").removeClass("d-none");
                }).mouseleave(function(){
                    $mask.addClass("d-none");
                    $("#div-lg").addClass("d-none");
                });
                // 简化
                $smask.hover(
                    function(){
                        $mask.removeClass("d-none");
                        $("#div-lg").removeClass("d-none");
                    },
                    function(){
                        $mask.addClass("d-none");
                        $("#div-lg").addClass("d-none");
                    }
                )*/
                // 更简化
                var max=176;
                $smask.hover(
                    function(){
                        $mask.toggleClass("d-none");
                        $("#div-lg").toggleClass("d-none");                                 
                    }
                )
                // 遮挡层和大图片跟着鼠标移动
                .mousemove(function(e){
                    var left=e.offsetX-88;
                    var top=e.offsetY-88;
                    if(left<0) left=0;
                    else if(left>max) left=max;
                    if(top<0) top=0;
                    else if(top>max) top=max;
                    $mask.css({left,top});
                    var backgroundPosition=`${-16/7*left}px ${-16/7*top}px`;
                    $("#div-lg").css({backgroundPosition});
                })
            }
        })
    }


})