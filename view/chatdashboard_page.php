<?php
if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $senderId = isset($_GET['senderId']) ? absint($_GET['senderId']) : 0;
    $receiverId = isset($_GET['receiverId']) ? absint($_GET['receiverId']) : 0;
    $receiver = get_userdata($receiverId);
    $receiver_photo = wp_get_attachment_url(get_user_meta($receiverId, 'profile_image', true), 'thumbnail');
    $receiverPhoto = !empty($receiver_photo) ? $receiver_photo : get_avatar_url($receiverId);
}
get_header('inner');
wp_head();



?>

<div class="container my-2">
    <div class="custom-modal" id="deleteConfirmModal">
        <div class="custom-modal-content">
            <div class="custom-modal-header">
                <span class="custom-modal-close" id="closeModal">&times;</span>
                <h5 class="custom-modal-title">Confirm Deletion</h5>
            </div>
            <div class="custom-modal-body">
                Are you sure you want to delete the selected messages?
            </div>
            <div class="custom-modal-footer">
                <button class="btn btn-secondary" id="cancelDelete">Cancel</button>
                <button class="btn btn-danger" id="confirmDelete">Confirm</button>
            </div>
        </div>
    </div>
    <div class="alert"></div>
    <div class="card shadow-lg">
        <div class="card-header d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <img src="<?php echo esc_url($receiverPhoto); ?>" alt="Receiver Image"
                    class="rounded-circle me-3" style="width: 50px; height: 50px;">
                <div>
                    <h5 class="mb-0"><?php echo esc_html($receiver->display_name); ?></h5>
                    <small class="text-muted">Chat with <?php echo esc_html($receiver->display_name); ?></small>
                </div>
            </div>
            <i class="btn btn-sm btn-danger btn-trash bi bi-trash"></i>
        </div>

        <div class="card-body" id="chatMessages">

        </div>
        <div class="card-footer mb-3">
            <form id="form_data" method="POST">
                <ul class="list-unstyled" id="recordedFiles"></ul>
                <input type="hidden" name="audioBlob" id="audioBlob">
                <input type="hidden" name="videoBlob" id="videoBlob">
                <input type="hidden" name="senderId" id="senderId" value="<?php echo $senderId ?>" />
                <input type="hidden" name="receiverId" id="receiverId" value="<?php echo $receiverId ?>" />
                <div id="gallery"></div>
                <input type="file" id="gallery-photo-add" name="images[]" multiple><br>
                <div class="d-flex">
                    <input type="text" class="form-control me-2" name="message" placeholder="Type a message..." id="chatInput">
                    <i class="btn btn-attachment btn-primary  mx-1 bi bi-paperclip"></i>
                    <i class="btn btn-primary  bi bi-mic-fill mx-1" id="toggleRecording"></i>
                    <i class="btn btn-primary bi bi-camera-video-fill mx-1" id="toggleVideoRecording"></i>
                    <button type="submit" class="btn btn-primary" id="sendMessageButton"><i class="mr-1 bi loading"></i>Send</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script type="module">
    import {
        initializeApp
    } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
    import {
        getDatabase,
        ref,
        onValue,
        remove,
        get,
        query,
        orderByChild,
        equalTo
    } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDUciGPOL9Mg5R9aoelFMvgigNYIB3xj2M",
        authDomain: "my-chatbot-project-48653.firebaseapp.com",
        databaseURL: "https://my-chatbot-project-48653-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "my-chatbot-project-48653",
        storageBucket: "my-chatbot-project-48653.firebasestorage.app",
        messagingSenderId: "1059953390534",
        appId: "1:1059953390534:web:9a516a6a400129ae7df8c7",
        measurementId: "G-FPVQDFGZSG"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    window.firebaseData = {
        app,
        database,
        ref,
        onValue,
        remove,
        get,
        query,
        orderByChild,
        equalTo
    };
</script>


<?php

wp_footer();
?>