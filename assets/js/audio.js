jQuery(document).ready(function ($) {
  "use strict";

  const $toggleBtn = $("#toggleRecording"),
    $ul = $("#recordedFiles");

  let recorder,
    chunks = [],
    stream,
    isRecording = false;

  $("#toggleRecording").click(async function (e) {
    e.preventDefault();
    alert("clicked");
    if (!isRecording) {
      try {
        console.log("Requesting microphone access...");
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Microphone access granted.");

        recorder = new MediaRecorder(stream);
        console.log("MediaRecorder initialized.");

        recorder.ondataavailable = (e) => {
          console.log("Data available from recorder.");
          chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg;" });
          chunks = [];
          const reader = new FileReader();

          reader.onloadend = (e) => {
            const base64Data = reader.result.split(",")[1];

            $("#audioBlob").val(base64Data);

            console.log("Audio data stored in hidden input field.");

            const url = URL.createObjectURL(blob);
            const $li = $("<li></li>");
            const $audio = $("<audio   controls ></audio>").attr("src", url);
            $("#recordedFiles").empty();
            $li.append($audio);
            $ul.append($li);

            console.log("Audio ready: ", url);
          };

          reader.readAsDataURL(blob);
        };

        recorder.start();
        isRecording = true;
        $toggleBtn.removeClass("bi-mic-fill").addClass("bi-mic-mute-fill");
        console.log("Recording started.");
      } catch (err) {
        console.log("Error accessing media devices: ", err.message);
      }
    } else {
      console.log("Stopping recording...");
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      isRecording = false;
      $toggleBtn.removeClass("bi-mic-mute-fill").addClass("bi-mic-fill");
      console.log("Recording stopped and stream released.");
    }
  });
});
