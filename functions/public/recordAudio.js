
// https://codepen.io/jeremyagottfried/pen/bMqyNZ

var storage = firebase.storage();
var storageRef = storage.ref();
var roomRef = storageRef.child(document.getElementById('roomID').innerText);

var blob; 

function handlerFunction(stream) {
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => {
        audioChunks.push(e.data);
        if (rec.state == "inactive") {
            blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
            recordedAudio.src = URL.createObjectURL(blob);
            recordedAudio.controls=true;
            recordedAudio.autoplay=true;
            console.log(recordedAudio.src);

            stream.getTracks().forEach(track => track.stop());
            sendData(blob);
        }
    }
}

function sendData(data) {}

record.onclick = async e => {
    playMetronome();
    await navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {handlerFunction(stream)});

    console.log('Recording audio...');
    record.disabled = true;
    record.style.backgroundColor = "red";
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
}

stopRecord.onclick = e => {
    stopMetronome();

    console.log("Recording stopped...");
    record.disabled = false;
    stopRecord.disabled=true;
    record.style.backgroundColor = "#8E79FC";
    rec.stop();
}

storeRecord.onclick = async e => {

    // check for valid name and recording is there

    var audioName = recordingName.value + ".mp3";
    console.log("audio name: " + audioName);

    audioRef = roomRef.child(audioName)

    var uploadTask = audioRef.put(blob);

    var metadata = {
        customMetadata: {
          'bpm': document.getElementById('bpm-input').value,
          'beat': document.getElementById('beat-input').value
        }
    }

    audioRef.updateMetadata(metadata)
    .catch(function(error) {});

    uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
    }, function(error) {
        // Handle unsuccessful uploads
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
        });
        document.getElementById('audioStoringAlert').style.visibility = "visible";
    });


    
}

playRecord.onclick = e => {
    var audiofiles = document.getElementsByClassName("audiofile");
    for (let i = 0; i < audiofiles.length; i++) {
        audiofiles[i].play();
    }
}

window.onload = getAudioFiles();

async function getAudioFiles() {
    var listRef = storageRef.child(document.getElementById('roomID').innerText);
    var firstPage = await listRef.list({ maxResults: 100});
    var audioItems = firstPage.items;


    for (let i = 0; i < audioItems.length; i++) {
        var audioLabel = audioItems[i].location.path.split('/').pop().split('.')[0];

        var audioName = document.createElement("P");
        audioName.id = audioName + "Name";
        audioName.innerText = audioLabel;
        document.getElementById('audioRecordings').appendChild(audioName);

        var myAudio = document.createElement("audio");
        myAudio.id = audioLabel;
        myAudio.className = "audiofile";
        myAudio.src = await audioItems[i].getDownloadURL();
        myAudio.controls = true;
        myAudio.autoplay = false;
        document.getElementById('audioRecordings').appendChild(myAudio);               

    }

}
