jQuery(document).ready(function ($) {
  console.log("Loaded Custom JS");
  // $(function () {
  //   var imagesPreview = function (input, placeToInsertImagePreview) {
  //     if (input.files) {
  //       console.log(input.files);
  //       var filesAmount = input.files.length;
  //       if (filesAmount > 5) {
  //         Swal.fire({
  //           text: "Please Select only 5 images",
  //           title: "Error",
  //           icon: "error",
  //         });
  //         input.value = "";
  //         return;
  //       }

  //       let selectedFiles = Array.from(input.files);
  //       console.log(selectedFiles);

  //       $.each(selectedFiles, function (key, file) {
  //         var reader = new FileReader();

  //         reader.onload = function (event) {
  //           var wrapper = $("<div>")
  //             .addClass("image-wrapper")
  //             .attr("data-flag", key); // Use `key` as a unique flag

  //           $("<img>")
  //             .attr("src", event.target.result)
  //             .attr("height", "100px")
  //             .attr("width", "100px")
  //             .appendTo(wrapper);

  //           var crossButton = $("<button>")
  //             .addClass("btn-close")
  //             .css({
  //               position: "absolute",
  //               top: "0",
  //               right: "0",
  //               color: "red",
  //               cursor: "pointer",
  //             })
  //             .on("click", function () {
  //               wrapper.remove();
  //             });

  //           crossButton.appendTo(wrapper);
  //           wrapper.appendTo(placeToInsertImagePreview); // Ensure this variable is defined in your code
  //         };

  //         reader.readAsDataURL(file);
  //       });
  //     }
  //   };

  //   $("#gallery-photo-add").on("change", function () {
  //     imagesPreview(this, "div.gallery");
  //   });
  // });

  $("#loader").hide();

  $(function () {
    var loaderTimeout;
    var MIN_LOADER_TIME = 2000;

    $(document).ajaxStart(function () {
      if (loaderTimeout) {
        clearTimeout(loaderTimeout);
      }

      $("#loader").show();

      loaderTimeout = setTimeout(function () {
        $("#loader").hide();
      }, MIN_LOADER_TIME);
    });

    $(document).ajaxStop(function () {
      $("#loader").hide();
    });

    $(document).ajaxError(function () {
      $("#loader").hide();
    });
  });
});
