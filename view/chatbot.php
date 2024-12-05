    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <title>Advanced Chatbot</title>
        <style>
            body {
                font-family: Arial, sans-serif;
            }

            .chat-container {
                width: 80%;
                margin: 0 auto;
                padding-top: 20px;
            }

            .chat-message {
                margin: 10px 0;
            }

            .user-message {
                color: blue;
            }

            .bot-message {
                color: green;
            }

            form {
                margin-top: 20px;
            }

            input[type="text"] {
                width: 80%;
                padding: 10px;
            }

            button {
                padding: 10px 20px;
                font-size: 16px;
            }
        </style>
    </head>

    <body>

        <div class="chat-container">
            <h1>Chatbot</h1>

            <!-- Display Chat History -->
            <div id="chat-history">
                <?php if ($messages): ?>
                    <?php foreach ($messages as $message): ?>
                        <div class="chat-message">
                            <strong>User:</strong> <span class="user-message"><?= htmlspecialchars($message['user']) ?></span>
                        </div>
                        <div class="chat-message">
                            <strong>Bot:</strong> <span class="bot-message"><?= htmlspecialchars($message['bot']) ?></span>
                        </div>
                        <hr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Chat Form -->
            <form method="post">
                <input type="text" name="message" placeholder="Type your message..." required>
                <button type="submit">Send</button>
            </form>
        </div>

    </body>

    </html>