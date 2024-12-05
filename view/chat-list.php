<div id="chat-dashboard" class="container  d-flex justify-content-center mt-4 w-100">
    <div class="card bg-light w-50">
        <div class="card-header bg-grey text-center">
            <h5 class="mb-0">Chat Dashboard</h5>
        </div>
        <div class="card-body">
            <ul id="chat-list" class="list-group">
                <?php if ($chats) {
                    function sortChatsByDateTime($chat1, $chat2)
                    {

                        $latestMessage1 = max(array_column($chat1, 'time'));
                        $latestMessage2 = max(array_column($chat2, 'time'));
                        return $latestMessage2 <=> $latestMessage1;
                    }

                    usort($chats, 'sortChatsByDateTime');

                ?>
                    <?php foreach ($chats as $chat): ?>
                        <?php
                        $lastMessage = end($chat);
                        if (isset($lastMessage['receiverId']) && absint($lastMessage['receiverId']) && isset($lastMessage['senderId']) && absint($lastMessage['senderId'])) {
                            if ($lastMessage['receiverId'] == $userId) {
                                $receiverId = $lastMessage['senderId'];
                            } else {
                                $receiverId = $lastMessage['receiverId'];
                            }
                            $receiverData = get_userdata($receiverId);
                            $receiver_photo = wp_get_attachment_url(get_user_meta($receiverId, 'profile_image', true), 'thumbnail');
                            $receiverPhoto = !empty($receiver_photo) ? $receiver_photo : get_avatar_url($receiverId);
                        }
                        ?>
                        <a href="<?php echo site_url('/chat-dashboard/?senderId=' . $userId . '&receiverId=' . $receiverId) ?>" class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <img src="<?php echo esc_url($receiverPhoto); ?>" alt="Receiver Image"
                                    class="rounded-circle me-3" style="width: 50px; height: 50px;">
                                <strong><?php echo htmlspecialchars($receiverData->data->display_name); ?>:</strong>
                                <?php echo htmlspecialchars($lastMessage['message']); ?>
                            </div>
                            <small class="text-muted"><?php
                                                        echo ($lastMessage['sendDate'] . ' ' . $lastMessage['strTime']);
                                                        ?></small>
                        </a>
                    <?php endforeach; ?>
                <?php } else { ?>
                    <li class="list-group-item text-center">No chats found.</li>
                <?php } ?>
            </ul>
        </div>
    </div>
</div>