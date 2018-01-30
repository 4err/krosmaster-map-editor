/**
 * Created by Denis on 10.10.2017.
 */
$(function () {

    var current_team = {
        lvl: 0,
        initiative: 0,
        krosmasters: []
    };


    $("#tabs").tabs({
        heightStyle: "content",
        classes: {
            "ui-tabs": "ui-vertical"
        }
    }).addClass('ui-tabs-vertical ui-helper-clearfix');

    var tmpl = _.template(document.getElementById('tab_template').innerHTML);
    var team_tmpl = _.template(document.getElementById('team_template').innerHTML);
    var result = tmpl({data: krosmasters, level: 1});
    $('#tabs-1').append(result);

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
        if ($('#tabs-' + num)[0].innerHTML == '') {
            result = tmpl({data: krosmasters, level: level});
            $('#tabs-' + num).append(result);
        }

    });
    // $('.js-enable-los').on('click', function () {
    //     toggleInvisible();
    // });

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

    $(document).on("click", ".prototype", function (event) {

        var krosmaster = krosmasters[$(this).data("title")];
        console.log(krosmaster);
        var check = check_add(current_team, krosmaster);
        if (check.valid) {
            current_team.krosmasters.push(krosmaster);

            current_team.krosmasters.sort(sortByInitiative);
            console.log(current_team);

            current_team.lvl += parseInt(krosmaster.level);
            current_team.initiative += parseInt(krosmaster.initiative);
            update_tabs(current_team.lvl);
        }
        else {
            $('.errors').empty();
            for(var i in check.errors) {
                var text = '<div>'+check.errors[i]+'</div>';
                console.log(text);
                $('.errors').append(text);
            }
        }

        var team_view = team_tmpl({data: current_team.krosmasters});
        $('.deck').empty().append(team_view);

        $('.team-lvl').text(current_team.lvl);
        $('.team-initiative').text(current_team.initiative);
    });
});