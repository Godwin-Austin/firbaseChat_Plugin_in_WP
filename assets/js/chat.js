jQuery(document).ready(function ($) {
  var senderId = $("#senderId").val();
  var receiverId = $("#receiverId").val();
  var selectedMessageIds = [];
  var uniqueIds = [];
  $(".btn-trash").hide();
  $("#deleteConfirmModal").hide();
  console.log("notification Sound : " + ajaxObj.notification);
  let notification = new Audio(ajaxObj.notification);
  console.log(notification);

  console.log("Admin Url : " + ajaxObj.ajaxUrl);
  const smileys = {
    ":D": "128513",
    ":)": "128522",
    ":(": "128577",
    ":O": "128558",
    ";)": "128521",
    ":P": "128539",
    ":p": "128539",
    ":|": "128528",
    ":/": "128533",
    ":S": "128534",
    ":*": "128536",
    ":@": "128544",
    ":'(": "128546",
    ":$": "128561",
    ":!": "129320",
    ":?": "129300",
    "^_^": "128522",
    ":-)": "128522",
    ":-(": "128577",
    ":-P": "128539",
    ":-O": "128558",
    ";-)": "128521",
    ":lol": "128514",
  };

  const { database, ref, onValue, remove, get, query, orderByChild, equalTo } =
    window.firebaseData;
  console.log(window.firebaseData);
  console.log(onValue);

  const chatRef = ref(
    database,
    "chats/" + senderId + "/" + senderId + "_to_" + receiverId
  );

  console.log(chatRef.toString());

  onValue(
    chatRef,
    (snapshot) => {
      console.log("Value Changed 1");
      console.log("ChatRef snapshot received");
      const messages = snapshot.val();
      console.log(messages);
      $("#recordedFiles").empty();
      notification.play();
      updateChatUI(messages);
    },
    (error) => {
      console.error("Error in ChatRef:", error);
    }
  );

  function updateChatUI(messages) {
    const chatMessagesContainer = $("#chatMessages");
    chatMessagesContainer.empty();
    $("#form_data")[0].reset();
    $.each(messages, function (key, message) {
      var deleteCheckbox = `<input type="checkbox" class="message-checkbox" data-message-id="${key}" style="display:none;" />`;
      var messageHtml = "";
      var timeToDisplay = message.strTime || "Invalid time";
      var messageId = $(this).data("message-id");
      if (message.senderId == senderId) {
        if (message.message && message.message.trim() !== "") {
          for (let index in smileys) {
            if (message.message.includes(index)) {
              message.message = message.message.replace(
                index,
                String.fromCodePoint(smileys[index])
              );
            }
          }
          messageHtml += `
                <div class="chat-message  chat-message-container d-flex justify-content-end mb-3"  data-message-id="${key}">
                    <div>
                        <div class="bg-primary text-white rounded p-2">
                            <p class="mb-0">${message.message}</p>
                        </div>
                        <small class="text-muted text-end d-block">${timeToDisplay}</small>
                    </div>
                     ${deleteCheckbox}  
                </div>
            `;
        }
        if (message.attachments && message.attachments.length > 0) {
          messageHtml += `<div class="chat-attachments   chat-message-container d-flex justify-content-end mb-3"  data-message-id="${key}">`;
          message.attachments.forEach(function (attachment) {
            messageHtml +=
              '<img src="' +
              attachment +
              '" class="chat-image" style="height:100px;width:100px;"/>';
          });
          messageHtml += `</div><small class="text-muted text-end d-block">${timeToDisplay}</small>`;
        }
        if (message.voice_recording) {
          messageHtml += `<div class="chat-attachments  chat-message-container  d-flex justify-content-end mb-3 "  data-message-id="${key}">
             <div>`;
          messageHtml += `<audio src="${message.voice_recording}"  controls ></audio>`;

          messageHtml += `</div>
            <small class="text-muted text-end d-block">${timeToDisplay}</small>
                 
                     ${deleteCheckbox}  
                </div>
          `;
        }

        if (message.video_recording) {
          messageHtml += `<div class="chat-attachments  chat-message-container  d-flex justify-content-end mb-3 "  data-message-id="${key}">
             <div>
                        <div class="bg-video text-white rounded p-2">`;
          messageHtml += `<video style="height:250px;width:300px;" src="${message.video_recording}"  controls ></video>`;
          messageHtml += `</div>
            <small class="text-muted text-end d-block">${timeToDisplay}</small>
                    </div>
                     ${deleteCheckbox}  
                </div>
          `;
        }
      } else {
        if (message.message && message.message.trim() !== "") {
          for (let index in smileys) {
            if (message.message.includes(index)) {
              message.message = message.message.replace(
                index,
                String.fromCodePoint(smileys[index])
              );
            }
          }
          messageHtml += `
                <div class="chat-message  chat-message-container  d-flex mb-3 "  data-message-id="${key}">
                    <div class="me-auto">
                        <div class="bg-light rounded p-2">
                            <p class="mb-0">${message.message}</p>
                        </div>
                        <small class="text-muted">${timeToDisplay}</small>
                    </div>
                    ${deleteCheckbox} 
                </div>
            `;
        }
        if (
          message.attachments &&
          Array.isArray(message.attachments) &&
          message.attachments.length > 0
        ) {
          messageHtml += `<div class="chat-attachments  chat-message-container  d-flex mb-3" data-message-id="${key}">`;
          message.attachments.forEach(function (attachment) {
            messageHtml +=
              '<img src="' +
              attachment +
              '" class="chat-image" style="height:100px;width:100px;"/>';
          });
          messageHtml += `     ${deleteCheckbox}  </div>  <small class="text-muted">${timeToDisplay}</small>`;
        }

        if (message.voice_recording) {
          messageHtml += `<div class="chat-attachments  chat-message-container  d-flex  mb-3 "   data-message-id="${key}">
             <div><div>`;
          messageHtml += `<audio src="${message.voice_recording}"  controls ></audio>`;

          messageHtml += `</div>
            <small class="text-muted text-end d-block">${timeToDisplay}</small>
                 </div>
                     ${deleteCheckbox}  
                </div>
          `;
        }

        if (message.video_recording) {
          messageHtml += `<div class="chat-attachments  chat-message-container  d-flex mb-3  "   data-message-id="${key}">
             <div>
                        <div class="bg-secondary text-white rounded p-2">`;
          messageHtml += `<video style="height:250px;width:300px;" src="${message.video_recording}"  controls ></video>`;
          messageHtml += `</div>
            <small class="text-muted text-end d-block">${timeToDisplay}</small>
                    </div>
                     ${deleteCheckbox}  
                </div>
          `;
        }
      }

      chatMessagesContainer.append(messageHtml);
    });

    $(".card-body").scrollTop($(".card-body")[0].scrollHeight);
  }

  $(document).on("click", ".chat-message-container", function () {
    var checkbox = $(this).find(".message-checkbox");
    var isChecked = checkbox.is(":checked");
    var messageId = $(this).data("message-id");
    checkbox.prop("checked", !isChecked);

    if (isChecked) {
      checkbox.hide();
      console.log(messageId);
      var index = selectedMessageIds.indexOf(messageId);
      if (index > -1) {
        selectedMessageIds.splice(index, 1);
      }
    } else {
      console.log(messageId);
      checkbox.show();
      if (!selectedMessageIds.includes(messageId)) {
        selectedMessageIds.push(messageId);
      }
    }

    if (selectedMessageIds.length > 0) {
      $(".btn-trash").show();
    } else {
      $(".btn-trash").hide();
    }
    console.log("Selected message IDs: ", selectedMessageIds);
  });

  $(document).on("click", ".btn-trash", async function () {
    if (
      selectedMessageIds &&
      Array.isArray(selectedMessageIds) &&
      selectedMessageIds.length > 0
    ) {
      let allWithinFiveMinutes = true;

      try {
        for (const messageId of selectedMessageIds) {
          let messageRef = ref(
            database,
            "chats/" +
              senderId +
              "/" +
              senderId +
              "_to_" +
              receiverId +
              "/" +
              messageId
          );

          let messageSnapshot = await get(messageRef);

          if (messageSnapshot.exists()) {
            const messageData = messageSnapshot.val();
            console.log(messageData);
            const messageTime = messageData.time;
            console.log(messageTime);
            const currentTime = Math.floor(Date.now() / 1000);
            const timeDifference = currentTime - messageTime;
            if (timeDifference <= 5 * 60) {
              uniqueIds.push(messageData.unique_id);
              console.log(uniqueIds);
            } else {
              allWithinFiveMinutes = false;
              break;
            }
          } else {
            console.warn(`Message with ID ${messageId} does not exist`);
          }
        }

        if (allWithinFiveMinutes) {
          $("#deleteConfirmModal").show();
        } else {
          for (const messageId of selectedMessageIds) {
            let messageRef = ref(
              database,
              "chats/" +
                senderId +
                "/" +
                senderId +
                "_to_" +
                receiverId +
                "/" +
                messageId
            );
            await remove(messageRef);
            console.log(`Message with ID ${messageId} deleted`);
          }
          selectedMessageIds = [];
          $(".btn-trash").hide();
          console.log("All selected messages deleted successfully");
          loadMessages();
        }
      } catch (error) {
        console.error("Error processing messages:", error);
      }
    } else {
      console.log("No messages selected for deletion");
    }
  });

  // $("#confirmDelete").click(async function () {
  //   if (
  //     selectedMessageIds &&
  //     Array.isArray(selectedMessageIds) &&
  //     selectedMessageIds.length > 0
  //   ) {
  //     try {
  //       const uniqueIds = [];

  //       for (const messageId of selectedMessageIds) {
  //         let messageRef = ref(
  //           database,
  //           "chats/" +
  //             senderId +
  //             "/" +
  //             senderId +
  //             "_to_" +
  //             receiverId +
  //             "/" +
  //             messageId
  //         );

  //         let messageSnapshot = await get(messageRef);

  //         if (messageSnapshot.exists()) {
  //           const messageData = messageSnapshot.val();
  //           console.log(`Sender's Message Data:`, messageData);

  //           const uniqueId = messageData.unique_id;
  //           if (uniqueId) {
  //             uniqueIds.push(uniqueId);
  //             console.log(uniqueIds);
  //           }
  //           await remove(messageRef);
  //           console.log(
  //             `Message with ID ${messageId} deleted from sender's node`
  //           );
  //         } else {
  //           console.warn(
  //             `Message with ID ${messageId} does not exist in sender's node`
  //           );
  //         }
  //       }

  //       const receiverMessagesRef = ref(
  //         database,
  //         "chats/" + receiverId + "/" + receiverId + "_to_" + senderId
  //       );

  //       const receiverMessagesSnapshot = await get(receiverMessagesRef);

  //       if (receiverMessagesSnapshot.exists()) {
  //         receiverMessagesSnapshot.forEach(async (childSnapshot) => {
  //           const messageData = childSnapshot.val();
  //           const messageId = childSnapshot.key;
  //           const uniqueId = messageData.unique_id;
  //           if (uniqueIds.includes(uniqueId)) {
  //             const messageRefToDelete = ref(
  //               database,
  //               "chats/" +
  //                 receiverId +
  //                 "/" +
  //                 receiverId +
  //                 "_to_" +
  //                 senderId +
  //                 "/" +
  //                 messageId
  //             );

  //             await remove(messageRefToDelete);
  //             console.log(
  //               `Message with ID ${messageId} deleted from receiver's node`
  //             );
  //           }
  //         });
  //       } else {
  //         console.warn("No messages found in receiver's node.");
  //       }

  //       selectedMessageIds = [];
  //       console.log("All selected messages deleted successfully");
  //       loadMessages();
  //     } catch (error) {
  //       console.error("Error processing messages:", error);
  //     }
  //   } else {
  //     console.log("No messages selected for deletion");
  //   }
  // });

  $("#confirmDelete").click(async function () {
    let receiverMessageIds = [];
    $("#deleteConfirmModal").hide();
    try {
      let messagesRef = ref(
        database,
        "chats/" + receiverId + "/" + receiverId + "_to_" + senderId
      );

      let messagesSnapshot = await get(messagesRef);

      if (messagesSnapshot.exists()) {
        const messageDatas = messagesSnapshot.val();
        for (messageId in messageDatas) {
          if (uniqueIds.includes(messageDatas[messageId].unique_id)) {
            receiverMessageIds.push(messageId);
          }
        }
      }

      console.log("Receiver message IDs to be deleted:", receiverMessageIds);
      console.log("Sendner message IDs to be deleted:", selectedMessageIds);
    } catch (error) {
      console.error("Error fetching or deleting messages:", error);
    }

    if (
      selectedMessageIds &&
      Array.isArray(selectedMessageIds) &&
      selectedMessageIds.length > 0 &&
      receiverMessageIds &&
      Array.isArray(receiverMessageIds) &&
      receiverMessageIds.length > 0
    ) {
      try {
        for (const messageId of receiverMessageIds) {
          const chatRefReceiver = ref(
            database,
            "chats/" +
              receiverId +
              "/" +
              receiverId +
              "_to_" +
              senderId +
              "/" +
              messageId
          );
          await remove(chatRefReceiver);
          console.log(`Receiver message with ID ${messageId} deleted`);
        }
        for (const messageId of selectedMessageIds) {
          const chatRefSender = ref(
            database,
            "chats/" +
              senderId +
              "/" +
              senderId +
              "_to_" +
              receiverId +
              "/" +
              messageId
          );
          await remove(chatRefSender);
          console.log(`Sender message with ID ${messageId} deleted`);
        }

        selectedMessageIds = [];
        $(".btn-trash").hide();
        console.log("All selected messages deleted successfully");
        loadMessages();
      } catch (error) {
        console.error("Error deleting messages:", error);
      }
    } else {
      console.log("No messages selected for deletion.");
    }
  });

  $("#cancelDelete").on("click", function () {
    $("#deleteConfirmModal").hide();
  });

  $("#closeModal").on("click", function () {
    $("#deleteConfirmModal").hide();
  });

  loadMessages();

  function loadMessages() {
    $.ajax({
      url: ajaxObject.ajaxUrl,
      type: "POST",
      data: {
        action: "load_messages",
        senderId: senderId,
        receiverId: receiverId,
      },
      success: function (response) {
        if (response.success) {
          var messages = response.data;
          updateChatUI(messages);
        } else {
          console.log("Error: No messages");
        }
      },
      error: function () {
        console.error("Error occurred while fetching messages.");
      },
    });
  }

  $("#form_data").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    formData.append("action", "send_chat_message");
    console.log(formData);
    var message = $("#chatInput").val().trim();
    console.log(message);
    var files = $("#gallery-photo-add")[0].files;
    var audio = $("#audioBlob").val().trim();
    var video = $("#videoBlob").val().trim();
    console.log("Files selected:", files);
    // var ajaxUrl = "http://localhost/wp/wp-admin/admin-ajax.php";
    $("#sendMessageButton i").attr("class", "bi-arrow-repeat");
    $("#sendMessageButton").attr("disabled", "disabled");
    if (message === "" && files.length === 0 && audio === "" && video === "") {
      $(".alert")
        .removeClass("alert-success")
        .addClass("alert-danger")
        .empty()
        .text("Please type a message before sending.");
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        "fast"
      );
      return;
    }

    $.ajax({
      url: ajaxObj.ajaxUrl,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response);
        $("#chatInput").val("");
        $("#gallery-photo-add").val("");
        $("#gallery").empty();
        $("#sendMessageButton i").removeClass("bi-arrow-repeat");
        $("#sendMessageButton").removeAttr("disabled");
        $(".alert")
          .removeClass("alert-success")
          .addClass("alert-danger")
          .empty()
          .text(response.data);
      },
      error: function () {
        $("#sendMessageButton i").removeClass("bi-arrow-repeat");
        $("#sendMessageButton").removeAttr("disabled");
        $(".alert")
          .removeClass("alert-success")
          .addClass("alert-danger")
          .empty()
          .text("Error occurred while sending the message.");
      },
    });
  });

  $(".btn-attachment").on("click", function (e) {
    e.preventDefault();
    $("#gallery-photo-add").click();
  });

  $(function () {
    let filesArray = [];

    function updateInputField(input, files) {
      input.value = "";
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
    }

    function displayImages(input, placeToInsertImagePreview) {
      const gallery = $(placeToInsertImagePreview);
      gallery.empty();

      filesArray.forEach((file, index) => {
        const reader = new FileReader();
        const currentIndex = index;

        reader.onload = function (event) {
          console.log("index=" + currentIndex);

          const wrapper = $("<div>")
            .addClass("image-wrapper")
            .attr("data-flag", currentIndex);

          $("<img>")
            .attr("src", event.target.result)
            .attr("height", "100px")
            .attr("width", "100px")
            .appendTo(wrapper);

          $("<button>")
            .addClass("btn-close")
            .css("background-color", "red")
            .on("click", function (e) {
              e.preventDefault();
              filesArray.splice(currentIndex, 1);
              updateInputField(input, filesArray);

              displayImages(input, placeToInsertImagePreview);
            })
            .appendTo(wrapper);

          wrapper.appendTo(gallery);
        };

        reader.readAsDataURL(file);
      });
    }

    $("#gallery-photo-add").on("change", function (e) {
      e.preventDefault();
      filesArray = Array.from(this.files);
      console.log(filesArray);
      if (filesArray.length > 5) {
        Swal.fire({
          text: "Please Select only 5 images",
          title: "Error",
          icon: "error",
        });
        filesArray = [];
        this.value = "";
        return;
      }
      displayImages(this, "#gallery");
    });
  });

  $(document).on("click", ".image-wrapper", function () {
    $(".image-wrapper").removeClass("addBorder");
    $(this).addClass("addBorder");
    var flag = $(this).data("flag");
    $(".featured_image_key").val("").val(flag);
  });
});
