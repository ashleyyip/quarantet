// const crunker = require('crunker');

var temp = [];

let audio = new Crunker();

audio.fetchAudio("/vivaldi.mp3", "/haydn.mp3")
    .then(buffers => audio.mergeAudio(buffers))
    .then(merged => audio.export(merged, "merged/mp3"))
    .then(output => audio.download(output.blob))
    .catch(error => {
        throw new Error(error);
    });