# My Chatbot Plugin

A WordPress plugin that integrates a simple chatbot using Firebase Realtime Database. This plugin allows users to interact with a chatbot and stores messages in Firebase. It also supports sending and receiving multimedia messages such as images, audio, and video.

## Features

- **Admin Panel**: A dashboard where you can interact with the chatbot and see message logs.
- **Multimedia Support**: Send and receive text, images, audio, and video.
- **Firebase Integration**: Stores chat messages and user interactions in Firebase Realtime Database.
- **Shortcode**: Embed the chatbot in any page or post using a simple shortcode.
- **Chat History**: View past conversations through the admin panel.

## Installation

1. **Download** the plugin files.
2. **Upload** the plugin folder to your WordPress site's `wp-content/plugins/` directory.
3. **Activate** the plugin via the WordPress admin dashboard.
4. **Set up Firebase**:
   - Create a Firebase project and download the `firebase-credentials.json` file.
   - Place the `firebase-credentials.json` file in the plugin root directory.
   - Make sure your Firebase Realtime Database is configured with proper read/write permissions.
5. **Set up Firebase Realtime Database**:
   - Create a Realtime Database in Firebase.
   - Set your database URL and credentials in the plugin code.

## Shortcodes

- `[chat_dashboard]`: Use this shortcode to display the chatbot interface on any page or post.

## Functions

### `firebase_menu`

- Adds a menu page to the WordPress admin dashboard for chatbot interactions.

### `firebase_menu_page`

- Displays the Firebase chatbot interaction page, allowing users to chat with the bot and save messages to Firebase.

### `getBotResponse($userMessage)`

- A function that takes the user's message and returns a predefined bot response based on the input.

### `handle_send_chat_message`

- Handles sending chat messages between users and saves them to Firebase.
- Supports text, images, audio, and video.

### `handle_load_messages`

- Loads the chat history between two users from Firebase and returns the messages.

### `chat_list`

- Returns a list of all chats for the logged-in user.

## Hooks

- `wp_ajax_send_chat_message`: Triggered when a message is sent between users.
- `wp_ajax_nopriv_send_chat_message`: Triggered for non-logged-in users.
- `wp_ajax_load_messages`: Fetches the chat messages for a specific user.
- `wp_ajax_nopriv_load_messages`: Fetches messages for non-logged-in users.
- `wp_ajax_chat_list`: Returns a list of all chats for the current user.

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project.
3. Download the `firebase-credentials.json` file and place it in the root of your plugin directory.
4. Update the Firebase Realtime Database URL and your credentials in the plugin configuration.

## Requirements

- **WordPress**: 5.0 or higher.
- **PHP**: 7.0 or higher.
- **Composer**: For installing Firebase dependencies.
- **Firebase**: Realtime Database.

## Assets

- **JavaScript**: Handles sending and receiving messages, audio, and video files.
- **CSS**: Basic styles for the chatbot interface.
- **Icons**: Bootstrap icons for the UI.

## Contributing

1. Fork the repository.
2. Clone your fork.
3. Create a new branch for your feature or bugfix.
4. Commit your changes.
5. Push to your fork.
6. Create a pull request.

## License

This plugin is released under the MIT License. See the LICENSE file for more details.

---

**Author**: Divyank  
**Plugin Name**: My Chatbot Plugin  
**Version**: 1.0
