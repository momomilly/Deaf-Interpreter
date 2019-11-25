// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function () {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/png");
    cameraOutput.classList.add("taken");
    // track.stop();

    $.ajax({
        url: 'http://localhost:3000/alphabetprocess',
        dataType: 'text',
        data: { data: cameraOutput.src },
        type: 'POST',
        success: function (result) {
            $("#showthis").html("<strong>" + JSON.stringify(result) + "</strong>");
            console.log(result);
            var r = JSON.parse(result);
            console.log(r.payload);
            //
            var image = 'alphabet.png';
            var aivalue = r.payload[0].displayName;
            var score = r.payload[0].classification.score;
            console.log(`aivalue=${aivalue}`);
            // open new windows
            // var win = window.open('show.html' + '?image=' + image + '&aivalue=' + aivalue, '_blank');
            var win = window.open('/alphabetresult' + '?image=' + image + '&aivalue=' + aivalue + '&score=' + score, '_self');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow popups for this website');
            }
        }
    });

};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);