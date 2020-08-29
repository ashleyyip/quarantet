// https://codepen.io/ganderzz/pen/Ezlfu

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var timer, noteCount, counting, accentPitch = 380, offBeatPitch = 200;
var delta = 0;
var curTime = 0.0;
var countdown = 3;


/*
Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
function schedule(isRecording) {
    while(curTime < context.currentTime + 0.1) {
        // console.log("curTime IR: " + isRecording);
        playNote(curTime, isRecording);
        updateTime();
    }
    // timer = window.setTimeout(schedule, 0.1, isRecording); // function, timeout, param to function
    timer = window.setTimeout(function() {
        schedule(isRecording);
    }, 0.1);
}

function updateTime() {
    curTime += 60.0 / parseInt($(".bpm-input").val(), 10);
    noteCount++;
}

/* Play note on a delayed interval of t */
function playNote(t, isRecording) {
    var note = context.createOscillator();

    if(noteCount == parseInt($(".counter-dots").val(), 10) ) {
        noteCount = 0;
    }
      

    if( $(".counter .dot").eq(noteCount).hasClass("active") ) {
        note.frequency.value = accentPitch;
        // console.log("playNote isRecording: " + isRecording);
        if (isRecording) {
            if (countdown == 0) {
                $("#countdownAlert").text("Begin!");
            }
            else {
                $("#countdownAlert").text(countdown);
                countdown--;
            }
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

// /* Add or subtract bpm */
// $(".bpm-minus, .bpm-plus").click(function() {
//     if($(this).hasClass("bpm-minus"))
//         $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) - 1 );
//     else
//         $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) + 1 );
// });


/* Activate dots for accents */
$(document).on("click", ".counter .dot", function() {
    $(this).toggleClass("active");
});

$(".options-btn").click(function() {
    $(".options").toggleClass("options-active");
});

/* Add dots when time signature is changed */
$(".counter-dots").on("change", function() {
    var _counter = $(".counter");
    _counter.html("");

    for(var i = 0; i < parseInt($(".counter-dots").val(), 10); i++) {
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
      playMetronome(false)
    }
});

function playMetronome(isRecording) {
    // console.log("isRecording: " + isRecording);
    countdown = 1;
    curTime = context.currentTime;
    noteCount = parseInt($(".counter-dots").val(), 10);
    schedule(isRecording);

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

