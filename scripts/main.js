let gameCode;
let codeExists;
let playCard;
let errorTimeout;
let buttonTimeout;

function bingo() {
    $("#checkCard").html("BINGO!");
    $('#checkCard').removeClass('check-card').addClass('bingo');
    $('.number').addClass('number-toggled');
}

function noBingo() {
    $("#checkCard").html("Not Yet Bingo");
    $('#checkCard').removeClass('check-card').addClass('not-yet-bingo');
    clearTimeout(buttonTimeout);
    buttonTimeout = setTimeout(() => {
        resetBingo();
    }, 2000);
}

function resetBingo() {
    $("#checkCard").html("Check Card");
    $('#checkCard').removeClass('bingo not-yet-bingo').addClass('check-card');
}

function getCard() {
    gameCode = $("#codeInput").val();
    if(!gameCode) {
        $("#errorMsg").html("Game code can't be empty.");
        $("#errorMsg").css('opacity', 1);
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
            $("#errorMsg").css('opacity', 0);
        }, 3000)
        return;
    }
    $("#openDashboard").html(`<span>Game code:</span> ${gameCode}`);
    newCard();
}

function changeCode() {
    $("#codeInput").val("");
    $("#gameBox").hide(500);
    $("#inputArea").show(500);
    codeExists = false;
}

function loadNumbers(nums, letter) {
    $(`#col${letter}`).html('');
    nums.forEach(num => {
        $(`#col${letter}`).append(
            `<p class="number">${num}</p>`
        );
    });
}

function newCard() {
    resetBingo();
    if (!$("#card").is(":hidden")) $("#card").hide(250);
    $.ajax({
        url: `http://www.hyeumine.com/getcard.php?bcode=${gameCode}`,
        method: "GET",
        success: function(data) {
            try {
                codeExists = true;
                playCard = $.parseJSON(data);
                console.log(playCard);
                loadNumbers(playCard.card.B, 'B');
                loadNumbers(playCard.card.I, 'I');
                loadNumbers(playCard.card.N, 'N');
                loadNumbers(playCard.card.G, 'G');
                loadNumbers(playCard.card.O, 'O');
                $("#card").show(500);
                $("#inputArea").hide(500);
                $("#gameBox").show(500);
            } catch (error) {
                codeExists = false;
                $("#codeInput").val("");
                $("#errorMsg").html("Game code doesn't exist.");
                $("#errorMsg").css('opacity', 1);
                clearTimeout(errorTimeout);
                errorTimeout = setTimeout(() => {
                    $("#errorMsg").css('opacity', 0);
                }, 3000)
            }
        }
    });
}

function checkCard() {
    $.ajax({
        url: `http://www.hyeumine.com/checkwin.php?playcard_token=${playCard.playcard_token}`,
        method: "GET",
        success: function(data) {
            if (data === '1') {
                bingo();
            } else {
                noBingo();
            }
        }
    })
}

$(document).ready(() => {
    $("#gameBox").hide(0);
    $("#logo").click(() => {
        if ($("#inputArea").is(":hidden")) {
            $("#codeInput").val("");
            $("#gameBox").hide(500);
            $("#inputArea").show(500);
        } else {
            window.location.href = "index.html";
        }
    });
    $("#createGame").click(() => {
        window.open ("http://www.hyeumine.com/bingodashboard.php", "_blank")
    });
    $("#gameBox").on('click', '.number', function() {
        $(this).toggleClass('number-toggled');
    });
    $("#inputArea").on('keypress', function(event) {
        if (event.which === 13) {
            getCard();
        }
    });
    $("#getCard").click(getCard);
    $("#changeCode").click(changeCode);
    $("#openDashboard").click(() => {
        window.open (`http://www.hyeumine.com/bingodashboard.php?bcode=${gameCode}`, "_blank");
    });
    $("#checkCard").click(checkCard);
    $("#newCard").click(newCard);
});