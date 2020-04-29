
// https://codepen.io/jeremyagottfried/pen/bMqyNZ

var storage = firebase.storage();
var storageRef = storage.ref();
// var audioRef = storageRef.child('myAudioFile.mp3');

navigator.mediaDevices.getUserMedia({audio:true})
.then(stream => {handlerFunction(stream)})


var blob; 

function handlerFunction(stream) {
  rec = new MediaRecorder(stream);
  rec.ondataavailable = e => {
      audioChunks.push(e.data);
      if (rec.state == "inactive"){
          blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
          recordedAudio.src = URL.createObjectURL(blob);
          recordedAudio.controls=true;
          recordedAudio.autoplay=true;
          sendData(blob)
      }
  }
}

function sendData(data) {}

record.onclick = e => {
    console.log('Recording audio...');
    record.disabled = true;
    record.style.backgroundColor = "blue";
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
}
stopRecord.onclick = e => {
    console.log("Recording stopped...");
    record.disabled = false;
    stopRecord.disabled=true;
    record.style.backgroundColor = "red";
    rec.stop();
}

storeRecord.onclick = e => {
    console.log("storing audio");
    var uploadTask = storageRef.child('myaudiofile.mp3').put(blob);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
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
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
        });
    });

    // ref.put(blob).then(function(snapshot) {
    //     console.log("uploaded blob");
    // });
}
// $(".storeRecord").click(function() {
//     console.log("storing");
// });
