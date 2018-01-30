/**
 * Created by Denis on 10.10.2017.
 */

/*Количество возможных одинаковых кроссмастеров */
function max_possible_cnt(color) {
    var max = 2;
    switch (color) {
        case 'white':
            max = 2;
            break;
        case 'yellow':
            max = 1;
            break;
        case 'black':
            max = 3;
            break;
    }

    return max;
}

/* Проверка свободного места в команде*/
function check_max_team_cnt(team) {
    var valid = false;

    if (team.length < 8) {
        valid = true;
    }

    return valid;
}

/* Проверка уровня команды*/
function check_team_lvl(team_lvl, krosmaster_lvl) {
    var valid = false;

    if ((team_lvl + parseInt(krosmaster_lvl)) <= 12) {
        valid = true;
    }

    return valid;
}

/* Проверка наличия в команде*/
function check_exist_in_team(team, name) {
    var counter = 0;
    var color = '';
    var valid = false;

    for (var i in team) {
        if (team[i].name == name) {
            color = team[i].color;
            counter++;
        }
    }

    if (counter < max_possible_cnt(color)) {
        valid = true;
    }

    return valid;
}

/*Проверка возможности добавить кросмастера в команду*/
function check_add(team, krosmaster) {
    var data = {
        valid: false,
        errors: []
    };

    if (!check_exist_in_team(team.krosmasters, krosmaster.name)) {
        data.errors.push('Слишком много копий одного персонажа');
    }

    if (!check_team_lvl(team.lvl, krosmaster.level)) {
        data.errors.push('Превышен максимальный уровень команды');
    }

    if (!check_max_team_cnt(team.krosmasters)) {
        data.errors.push('Превышено максимальное количество кросмастеров');
    }

    if (data.errors.length == 0) {
        data.valid = true;
    }

    return data;
}

function sortByInitiative(a, b) {
    if (parseInt(a.initiative) > parseInt(b.initiative)) {
        return -1;
    }
    if (parseInt(a.initiative) < parseInt(b.initiative)) {
        return 1;
    }
}

function update_tabs(lvl) {
    if (lvl == 12) {
        $('#tabs').hide();
    }
    else {
        var tab = $("#tabs").tabs("option", "active") + 1;

        for (var i = 1; i <= 6; i++) {
            if ((lvl + i) > 12) {
                $('[href="#tabs-' + i + '"]').closest('li').hide();

                if (tab == i) {
                    $('[href="#tabs-1"]').click();
                }
            }
        }
    }
}


