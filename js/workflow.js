$(function () {
    $("#tabs").tabs({
        heightStyle: "content"
    });

    $("#choice_map").change(function () {
        if (this.value === 'empty') {
            $(".map-workflow").css("background-image", "url(./img/maps/" + this.value + ".png)");
        } else {
            $(".map-workflow").css("background-image", "url(./img/maps/" + this.value + ".jpg)");
        }
    });

    //Fermetures des dialogs
    $("#dialog_enreg").dialog({
        height: 180
        , width: 500
    }).dialog("close");

    //Rends les canvas invisibles
    $("#createur").hide();
    $("#canvas").hide();
    $("#canvasKit").hide();
    $("#accordion").accordion({
        heightStyle: "content"
    });

    //Check quater of map-workflow
    function get_workflow_quater(top, left) {
        top = top - $('.map-workflow').position().top;
        left = left - $('.map-workflow').position().left;
        width = 900;
        height = 900;

        if (left<=width/2 && top<=height/2){
            return 'left-top-corner'
        }
        if (left<=width/2 && top>=height/2){
            return 'left-bottom-corner'
        }
        if (left>=width/2 && top<=height/2){
            return 'right-top-corner'
        }
        if (left>=width/2 && top>=height/2){
            return 'right-bottom-corner'
        }

    }
    //Event liées à prototype
    //Avec la creation d'un jeton lors du draggage du dit prototype.
    //Le jeton obtenant draggage et divers capacitée liés au jeton
    function dragg() {
        $(".prototype").draggable({
            delay: 100
            , appendTo: ".map-workflow"
            , containment: "parent"
            , cursor: "move"
            , scroll: true
            , scrollSpeed: 30
            , scrollSensitivity: 100
            , helper: "clone"
            , stop: function (event, ui) {
                var jeton = $("<div class = 'jeton " + $(this)[0].classList[1]+ ' ' + $(this)[0].classList[2] +"'>" + $(this).html() + "</div>").appendTo("body").css({
                    "position": "absolute"
                    , "left": ui.offset.left
                    , "top": ui.offset.top
                    , "border-color": $(this).css("borderTopColor")
                }).draggable({
                    delay: 100
                    , containment: ".map-workflow"
                    , cursor: "move"
                    , scroll: true
                    , scrollSpeed: 30
                    , scrollSensitivity: 100
                    , drag: function (event, ui) {
                        var direct = get_workflow_quater(ui.offset.top, ui.offset.left);
                        if(!$(this).hasClass(direct)){
                            $(this).removeClass('left-top-corner right-top-corner right-bottom-corner left-bottom-corner');
                            $(this).addClass(direct);
                        }
                    },
                    start: function (event) {
                        cs.mouseHandler(event, 'removeObstructive');
                    },
                    stop: function (event) {
                        if ($('.jeton').length == 1) {
                            cs.mouseHandler(event, 'moveHero');
                        } else {
                            cs.mouseHandler(event, 'addObstructive', true);
                        }
                    }
                });

                var direct = get_workflow_quater(ui.offset.top, ui.offset.left);
                $(jeton).addClass(direct);
                if ($(this).hasClass('krosmaster')) {
                    var krosmaster_name = $(this)[0].classList[2];

                    if ($('.jeton.'+krosmaster_name).length > 1) {
                        $(jeton).append('<div class="krosmaster-num">'+$('.jeton.'+krosmaster_name).length+'</div>');
                    }
                }

                if ($('.jeton').length == 1) {
                    cs.mouseHandler(event, 'moveHero');
                } else {
                    cs.mouseHandler(event, 'addObstructive', true);
                }

            }
        });
    };

    //Gestion des jetons
    //Changement de couleur du circle via click gauche
    $(document).on("dblclick", ".jeton", function (event) {

        if (event.shiftKey) {
            cs.mouseHandler(event, 'addObstructive');
        } else {
            cs.mouseHandler(event, 'moveHero');
        }
        // if (event.which == 1) {
        //     var dico_couleur = {
        //         "rgb(0, 0, 0)": "blue"
        //         , "rgb(0, 0, 255)": "red"
        //         , "rgb(255, 0, 0)": "orange"
        //         , "rgb(255, 165, 0)": "purple"
        //         , "rgb(128, 0, 128)": "black"
        //     };
        //     $(this).css("border-color", dico_couleur[$(this).css("borderTopColor")]);
        // }
    });
    //Empeche d'ouvrir le contextmenu
    //$(document).on("contextmenu",".prototype, #dialog, #map,",function(event){return false;});
    //Destruction d'un jeton sur clic droit
    $(document).on("contextmenu", ".jeton", function (event) {
        $(this).remove();
        cs.mouseHandler(event, 'removeObstructive');

        return false;
    });
    //Gestion de l'enregistrement de l'image et du bouton lié
    $("#bouton_enreg").button();
    $(document).on("click", "#bouton_enreg", function (event) {
        $("#dialog_enreg").dialog("open");
    });
    $("#bouton_valid").button();
    $(document).on("click", "#bouton_valid", function (event) {
        $("#canvas").attr("width", $("#qualite").val()).attr("height", $("#qualite").val());
        var ratio = $("#qualite").val() / 1196;
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.src = $("#map").attr("src");
        img.alt = "test";
        ctx.drawImage(img, 0, 0, 1196, 1196, 0, 0, 1196 * ratio, 1196 * ratio);
        $(".jeton").each(function () {
            var imgJeton = new Image();
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var jeton = $("img", this);
            imgJeton.src = jeton.attr("src");
            var posJeton = jeton.offset();
            var posMap = $("#map").offset();
            if ($(this).attr("class") == 'jeton kit ui-draggable') {
                ctx.drawImage(imgJeton, 0, 0, 93, 93, ratio * (posJeton.left - posMap.left), ratio * (posJeton.top - posMap.top), 93 * ratio, 93 * ratio);
                if ($("#symC").prop("checked")) {
                    ctx.transform(-1, 0, 0, -1, 1196 * ratio, 1196 * ratio);
                    ctx.drawImage(imgJeton, 0, 0, 93, 93, ratio * (posJeton.left - posMap.left), ratio * (posJeton.top - posMap.top), 93 * ratio, 93 * ratio);
                    ctx.transform(1, 0, 0, 1, 0, 0);
                }
            }
            else if ($(this).attr("class") == 'jeton truc ui-draggable') {
                ctx.drawImage(imgJeton, 0, 0, 40, 40, ratio * (posJeton.left - posMap.left), ratio * (posJeton.top - posMap.top), 40 * ratio, 40 * ratio);
            }
            else {
                ctx.drawImage(imgJeton, 0, 0, 72, 72, ratio * (posJeton.left - posMap.left), ratio * (posJeton.top - posMap.top), 72 * ratio, 72 * ratio);
            }
            if ($(this).attr("class") == 'jeton circle ui-draggable') {
                //circle
                ctx.beginPath();
                ctx.strokeStyle = $(this).css("borderTopColor");
                ctx.lineWidth = ratio * 8;
                ctx.arc(ratio * (posJeton.left - posMap.left + 36), ratio * (posJeton.top - posMap.top + 36), ratio * 40, 0, 6.28);
                ctx.stroke();
                ctx.closePath();
            }
        });
        canvas.toBlob(function (blob) {
            saveAs(blob, $("#nomImage").val() + ".png");
        });
    });
    //Gestion de l'aide
    $("#bombe_tooltip").button();
    $(document).on("click", "#bombe_tooltip", function () {
        $("#dialog_aide").dialog("open");
    });

    // function CreerTriangle(orientation, couleur) {
    //     var canvas = document.getElementById("createur");
    //     var context = canvas.getContext("2d");
    //     context.setTransform(1, 0, 0, 1, 0, 0);
    //     context.clearRect(0, 0, 72, 72);
    //     context.translate(36, 36);
    //     // translate and rotate
    //     if (orientation == "left") {
    //         context.rotate(Math.PI / 2);
    //     }
    //     else if (orientation == "bottom") {
    //         context.rotate(Math.PI);
    //     }
    //     else if (orientation == "right") {
    //         context.rotate(3 * Math.PI / 2);
    //     }
    //     context.fillStyle = couleur;
    //     context.beginPath();
    //     context.moveTo(-36, 24);
    //     context.lineTo(0, -36);
    //     context.lineTo(36, 24);
    //     context.lineTo(19, 24);
    //     context.lineTo(10, 12);
    //     context.lineTo(10, 36);
    //     context.lineTo(-10, 36);
    //     context.lineTo(-10, 12);
    //     context.lineTo(-19, 24);
    //     context.lineTo(0, 24);
    //     context.fill();
    //     context.closePath();
    //     return canvas.toDataURL();
    // }
    //
    // function CreerAngle(orientation, couleur) {
    //     var canvas = document.getElementById("createur");
    //     var context = canvas.getContext("2d");
    //     context.setTransform(1, 0, 0, 1, 0, 0);
    //     context.clearRect(0, 0, 72, 72);
    //     context.translate(36, 36);
    //     var rectWidth = 72;
    //     var rectHeight = 20;
    //     // translate and rotate
    //     if (orientation == "aleft") {
    //         context.rotate(Math.PI / 2);
    //     }
    //     else if (orientation == "abottom") {
    //         context.rotate(Math.PI);
    //     }
    //     else if (orientation == "aright") {
    //         context.rotate(3 * Math.PI / 2);
    //     }
    //     context.fillStyle = couleur;
    //     context.fillRect(rectHeight / -2, rectWidth / -2, rectHeight, rectWidth - 26);
    //     context.fillRect(rectWidth / -2, rectHeight / -2, rectWidth - 26, rectHeight);
    //     return canvas.toDataURL();
    // }
    //
    // function CreerRect(orientation, couleur) {
    //     var canvas = document.getElementById("createur");
    //     var context = canvas.getContext("2d");
    //     context.setTransform(1, 0, 0, 1, 0, 0);
    //     context.clearRect(0, 0, 72, 72);
    //     context.translate(36, 36);
    //     context.fillStyle = couleur;
    //     var rectWidth = 72;
    //     var rectHeight = 20;
    //     // translate and rotate
    //     if (orientation == "hori") {
    //         context.rotate(Math.PI / 2);
    //     }
    //     context.fillStyle = couleur;
    //     context.fillRect(rectHeight / -2, rectWidth / -2, rectHeight, rectWidth);
    //     return canvas.toDataURL();
    // }
    //
    // function CreerCroix(couleur) {
    //     var canvas = document.getElementById("createur");
    //     var context = canvas.getContext("2d");
    //     context.setTransform(1, 0, 0, 1, 0, 0);
    //     context.clearRect(0, 0, 72, 72);
    //     context.fillStyle = couleur;
    //     var rectWidth = 72;
    //     var rectHeight = 15;
    //     // translate context to center of canvas
    //     context.translate(canvas.width / 2, canvas.height / 2);
    //     // rotate 45 degrees clockwise
    //     context.rotate(Math.PI / 4);
    //     context.fillStyle = couleur;
    //     context.fillRect(rectWidth / -2, rectHeight / -2, rectWidth, rectHeight);
    //     context.fillRect(rectHeight / -2, rectWidth / -2, rectHeight, rectWidth);
    //     return canvas.toDataURL();
    // }

    function tournerKit(url) {
        var canvas = document.getElementById("canvasKit");
        var context = canvas.getContext("2d");
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, 93, 93);
        context.translate(93, 0);
        var img = new Image();
        img.src = url
        // translate and rotate
        context.rotate(Math.PI / 2);
        context.drawImage(img, 0, 0);
        return canvas.toDataURL();
    }

    $(document).on("dblclick", ".kit", function (event) {
        if (event.which == 1) {
            $(this).children("img").attr("src", tournerKit($(this).children("img").attr("src")));
        }
    });
    // $(document).on("dblclick", ".schema", function (event) {
    //     if (event.which == 1) {
    //         if ($(this).children("img").hasClass(".black")) {
    //             var couleur = "blue"
    //         }
    //         if ($(this).children("img").hasClass(".blue")) {
    //             var couleur = "red"
    //         }
    //         if ($(this).children("img").hasClass(".red")) {
    //             var couleur = "orange"
    //         }
    //         if ($(this).children("img").hasClass(".orange")) {
    //             var couleur = "purple"
    //         }
    //         if ($(this).children("img").hasClass(".purple")) {
    //             var couleur = "black"
    //         }
    //         if ($(this).children("img").hasClass(".croix")) {
    //             $(this).children("img").attr("src", CreerCroix(couleur)).removeClass().addClass(".croix").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".top")) {
    //             $(this).children("img").attr("src", CreerTriangle("top", couleur)).removeClass().addClass(".top").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".bottom")) {
    //             $(this).children("img").attr("src", CreerTriangle("bottom", couleur)).removeClass().addClass(".bottom").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".left")) {
    //             $(this).children("img").attr("src", CreerTriangle("left", couleur)).removeClass().addClass(".left").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".right")) {
    //             $(this).children("img").attr("src", CreerTriangle("right", couleur)).removeClass().addClass(".right").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".atop")) {
    //             $(this).children("img").attr("src", CreerAngle("atop", couleur)).removeClass().addClass(".atop").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".abottom")) {
    //             $(this).children("img").attr("src", CreerAngle("abottom", couleur)).removeClass().addClass(".abottom").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".aleft")) {
    //             $(this).children("img").attr("src", CreerAngle("aleft", couleur)).removeClass().addClass(".aleft").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".aright")) {
    //             $(this).children("img").attr("src", CreerAngle("aright", couleur)).removeClass().addClass(".aright").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".vert")) {
    //             $(this).children("img").attr("src", CreerRect("vert", couleur)).removeClass().addClass(".vert").addClass("." + couleur);
    //         }
    //         if ($(this).children("img").hasClass(".hori")) {
    //             $(this).children("img").attr("src", CreerRect("hori", couleur)).removeClass().addClass(".hori").addClass("." + couleur);
    //         }
    //     }
    // });
    // $("<span class = 'prototype schema'><img src ='" + CreerTriangle("left", "black") + "' class = '.left .black' ></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerTriangle("right", "black") + "'class = '.right .black' ></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerTriangle("top", "black") + "' class = '.top .black'></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerTriangle("bottom", "black") + "'class = '.bottom .black' ></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerAngle("atop", "black") + "' class = '.atop .black'></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerAngle("aright", "black") + "'class = '.aright .black' ></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerAngle("abottom", "black") + "'class = '.abottom .black' ></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerAngle("aleft", "black") + "' class = '.aleft .black' ></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerRect("verti", "black") + "' class = '.vert .black'></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerRect("hori", "black") + "' class = '.hori .black'></span>").appendTo("#tabs-8");
    // $("<span class = 'prototype schema'><img src ='" + CreerCroix("black") + "' class = '.croix .black'></span>").appendTo("#tabs-8");

    $('.js-kamas-button').on('click', function () {
        var count = parseInt(document.querySelector('.js-kamas-counter').innerHTML, 10);
        if($(this).is('.js-kamas-plus')){
            count++;
        } else {
            if (count>0) {
                count--;
            }
        }
        document.querySelector('.js-kamas-counter').innerHTML = count;

        return false;
    });

    Start();

    $('.js-move-hero').on('click', function () {
        moveHero();
    });
    $('.js-toggle-distance').on('click', function () {
        toggleDistance();
    });
    $('.js-clear-los').on('click', function () {
        clearSight();
    });
    $('.js-load-map').on('click', function () {
        var map = $("#choice_map option:selected").val();
        loadMap(map);
    });
    $('.js-enable-los').on('click', function () {
        toggleInvisible();
    });

    $('.js-enable-help').on('click', function () {
        $('body').toggleClass('popup-background');
        $('.help-popup').toggleClass('show');
        return false;
    });

    $('body').on('click', function () {
        if ($('body').hasClass('popup-background')) {
            $('body').toggleClass('popup-background');
            $('.help-popup').toggleClass('show');
        }

    });

    var tmpl = _.template(document.getElementById('tab_template').innerHTML);
    var result = tmpl({data: krosmasters, level: 1});
    $('#tabs-1').append(result);
    dragg();

    $('.js-tab').on('click', function () {
        var level = $(this).data('level');
        var num = 0;
        switch (level) {
            case 'eternal':
                num = 7;
                break;
            case 'ban':
                num = 8;
                break;
            case 'boss':
                num = 9;
                break;
            default:
                num = level;
                break;
        }
        if($('#tabs-' + num)[0].innerHTML == '') {
            result = tmpl({data: krosmasters, level: level});
            $('#tabs-'+ num).append(result);
            console.log('страница загружена!');
            dragg();
        }

    });
});