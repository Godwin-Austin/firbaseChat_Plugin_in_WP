jQuery(document).ready(function ($) {
  "use strict";
  const $toggleBtn = $("#toggleVideoRecording"),
    $videoFeed = $("#videoFeed"),
    $ul = $("#recordedFiles");

  let recorder,
    chunks = [],
    stream,
    isRecording = false;

  async function startRecording() {
    try {
      console.log("Requesting camera access...");
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Camera access granted.");

      recorder = new MediaRecorder(stream);
      console.log("MediaRecorder initialized.");

      recorder.ondataavailable = (e) => {
        console.log("Data available from recorder.");
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        console.log("Recording stopped, processing video data...");
        const blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        const reader = new FileReader();

        reader.onloadend = (e) => {
          const base64Data = reader.result.split(",")[1];
          $("#videoBlob").val(base64Data);
          console.log("Video data stored in hidden input field.");
          const url = URL.createObjectURL(blob);
          console.log("Creating video playback and download link.");
          const $li = $("<li></li>");
          const $video = $(
            "<video style='height:200px; width:200px;' controls></video>"
          ).attr("src", url);
          $li.append($video);
          $ul.append($li);
          console.log("Video ready: ", url);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      isRecording = true;
      $toggleBtn
        .removeClass("bi-camera-video-fill")
        .addClass("bi-camera-video-off-fill");
      console.log("Recording started.");
    } catch (err) {
      console.log("Error accessing media devices: ", err.message);
    }
  }

  function stopRecording() {
    console.log("Stopping recording...");
    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
    isRecording = false;
    $toggleBtn
      .removeClass("bi-camera-video-off-fill")
      .addClass("bi-camera-video-fill");
    console.log("Recording stopped and stream released.");
  }

  // Toggle recording state
  $("#toggleVideoRecording").click(function () {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });
});
