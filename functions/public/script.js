// https://codepen.io/ganderzz/pen/Ezlfu

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var timer, noteCount, counting, accentPitch = 380, offBeatPitch = 200;
var delta = 0;
var curTime = 0.0;
var countdown = 3;

// Load up dots on pageload
$("document").ready(function() {
    $(".ts-top").trigger("change");
});


/*
Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
function schedule() {
    while(curTime < context.currentTime + 0.1) {
        playNote(curTime);
        updateTime();
    }
    timer = window.setTimeout(schedule, 0.1);
}

function updateTime() {
    curTime += 60.0 / parseInt($(".bpm-input").val(), 10);
    noteCount++;
}

/* Play note on a delayed interval of t */
function playNote(t) {
    var note = context.createOscillator();

    if(noteCount == parseInt($(".ts-top").val(), 10) ) {
        noteCount = 0;
    }
      

    if( $(".counter .dot").eq(noteCount).hasClass("active") ) {
        note.frequency.value = accentPitch;
        if (countdown == 0) {
            $("#countdownAlert").text("Begin!");
        }
        else {
            $("#countdownAlert").text(countdown);
            countdown--;
        }
        
    }
    else {
        note.frequency.value = offBeatPitch;
    }
    note.connect(context.destination);

    note.start(t);
    note.stop(t + 0.05);

    $(".counter .dot").attr("style", "");

    $(".counter .dot").eq(noteCount).css({
      transform: "translateY(-10px)",
      background: "#F75454"
    });
}

function countDown() {
  var t = $(".timer");

  if( parseInt(t.val(), 10) > 0 && counting === true)
  {
      t.val( parseInt(t.val(), 10) - 1 );
      window.setTimeout(countDown, 1000);
  }
  else
  {
    $(".play-btn").click();
    t.val(60);
  }
}

/* Tap tempo */
$(".tap-btn").click(function() {
  var d = new Date();
  var temp = parseInt(d.getTime(), 10);

  $(".bpm-input").val( Math.ceil(60000 / (temp - delta)) );
  delta = temp;
});

/* Add or subtract bpm */
$(".bpm-minus, .bpm-plus").click(function() {
    if($(this).hasClass("bpm-minus"))
        $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) - 1 );
    else
        $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) + 1 );
});

// /* Change pitches for tones in options */
// $(".beat-range, .accent-range").change(function() {
//   if($(this).hasClass("beat-range"))
//     offBeatPitch = $(this).val();
//   else
//      accentPitch = $(this).val();
// });

/* Activate dots for accents */
$(document).on("click", ".counter .dot", function() {
    $(this).toggleClass("active");
});

$(".options-btn").click(function() {
    $(".options").toggleClass("options-active");
});

/* Add dots when time signature is changed */
$(".ts-top, .ts-bottom").on("change", function() {
    var _counter = $(".counter");
    _counter.html("");

    for(var i = 0; i < parseInt($(".ts-top").val(), 10); i++) {
        var temp = document.createElement("div");
        temp.className = "dot";

        if(i === 0)
        temp.className += " active";

        _counter.append( temp );
    }
});


/* Play and stop button */
$(".play-btn").click(function() {
    context.resume();
    if($(this).data("what") === "pause") {
      stopMetronome();

    }
    else {
      playMetronome()
    }
});

function playMetronome() {
    countdown = 3;
    curTime = context.currentTime;
    noteCount = parseInt($(".ts-top").val(), 10);
    schedule();

    $(".play-btn").data("what", "pause").css({
        background: "#F75454",
        color: "#FFF"
    }).text("Stop");
}

function stopMetronome() {
    counting = false;
    window.clearInterval(timer);
    $(".counter .dot").attr("style", "");
    $(".play-btn").data("what", "play").attr("style","").text("Play");
}
