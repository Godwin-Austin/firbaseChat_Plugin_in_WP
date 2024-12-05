<?php
// Plugin Name: My Chatbot Plugin
//Author Name : Divyank
require plugin_dir_path(__FILE__) . 'vendor/autoload.php';

define('CHAT_DASHBOARD', plugin_dir_url(__FILE__));

use Kreait\Firebase\Factory;


define('FIREBASE_PLUGIN_PATH', plugin_dir_path(__FILE__));

add_action('admin_menu', 'firebase_menu');

function firebase_menu()
{
    add_menu_page(
        'firebase',
        'firebase',
        'manage_options',
        'Firebase',
        'firebase_menu_page',
        '',
        25
    );
}

function firebase_menu_page()
{

    $firebase = (new Factory)
        ->withServiceAccount(FIREBASE_PLUGIN_PATH . 'firebase-credentials.json')
        ->withDatabaseUri('https://my-chatbot-project-48653-default-rtdb.asia-southeast1.firebasedatabase.app/')
        ->createDatabase();

    function getBotResponse($userMessage)
    {
        $userMessage = strtolower($userMessage);
        $response = "Sorry, I don't understand. Can you try asking something else?";
        if (preg_match('/\b(hello|hi|hey)\b/', $userMessage)) {
            $response = "Hello! How can I assist you today?";
        } elseif (preg_match('/\b(help|support|assist)\b/', $userMessage)) {
            $response = "I'm here to help! What do you need assistance with?";
        } elseif (preg_match('/\b(how are you|what are you)\b/', $userMessage)) {
            $response = "I'm doing great, thanks for asking! How can I help you today?";
        } elseif (preg_match('/\b(bye|goodbye|see you)\b/', $userMessage)) {
            $response = "Goodbye! Have a great day!";
        } elseif (preg_match('/\b(name|who are you)\b/', $userMessage)) {
            $response = "I'm your friendly chatbot. How can I assist you today?";
        } else {
            $response = "I'm sorry, I didn't quite get that. Could you try asking something else?";
        }
        return $response;
    }


    if (isset($_POST['message'])) {
        $userMessage = $_POST['message'];
        $botResponse = getBotResponse($userMessage);
        $database = $firebase->getReference('chatbot/messages')
            ->push([
                'user' => $userMessage,
                'bot' => $botResponse,
                'timestamp' => time()
            ]);
    }

    $messagesSnapshot = $firebase->getReference('chatbot/messages')->getSnapshot();
    $messages = $messagesSnapshot->getValue();

    include(FIREBASE_PLUGIN_PATH . 'html/chatbot.php');
}

add_action('wp_enqueue_scripts', 'load_assets');
function load_assets()
{
    wp_enqueue_script('chat-js', CHAT_DASHBOARD . 'assets/js/chat.js', array('jquery'), null, true);
    // wp_localize_script('chat-js', 'ajaxObject', array('ajaxUrl' => admin_url('admin-ajax.php')));
    wp_localize_script('chat-js', 'ajaxObj', array('notification' => CHAT_DASHBOARD . 'assets/audio/notification.mp3', 'ajaxUrl' => admin_url('admin-ajax.php')));
    wp_enqueue_style('chat-css', CHAT_DASHBOARD . 'assets/css/chat.css');
    wp_enqueue_script('chat-audio-js', CHAT_DASHBOARD . 'assets/js/audio.js', array('jquery'), null, true);
    wp_enqueue_script('chat-video-js', CHAT_DASHBOARD . 'assets/js/video.js', array('jquery'), null, true);
    wp_enqueue_style('chat-bootstrap-icon', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css');
}

add_shortcode('chat_dashboard', 'chat_dashboard_page');

function chat_dashboard_page()
{
    include FIREBASE_PLUGIN_PATH . 'view/chatdashboard_page.php';
}


function handle_send_chat_message()
{
    if (isset($_POST['senderId']) && isset($_POST['receiverId'])) {
        print_r($_POST);
        $sender_id = sanitize_text_field($_POST['senderId']);
        $receiver_id = sanitize_text_field($_POST['receiverId']);
        $attachments = [];
        $upload_dir = wp_upload_dir();
        $audio = isset($_POST['audioBlob']) ? sanitize_text_field($_POST['audioBlob']) : "";
        $video = isset($_POST['videoBlob']) ? sanitize_text_field($_POST['videoBlob']) : "";
        $message = isset($_POST['message']) ? sanitize_textarea_field($_POST['message']) : "";

        if (!empty($_FILES['images']['name'][0])) {

            foreach ($_FILES['images']['tmp_name'] as $key => $imageTmpName) {
                $image_data = file_get_contents($imageTmpName);
                $image_name = $_FILES['images']['name'][$key];
                $image_path = $upload_dir['path'] . '/' . $image_name;
                $image_url = $upload_dir['url'] . '/' . $image_name;
                if (file_put_contents($image_path, $image_data) !== FALSE) {
                    $attachments[] = $image_url;
                }
            }
        }

        if (!empty($audio)) {
            $audioData = base64_decode($audio);
            $audioPath = $upload_dir['path'] . '/' . 'voiceRecording' . time() . substr(time(), 5) . '.ogg';
            if (file_put_contents($audioPath, $audioData)) {
                $audioUrl = $upload_dir['url'] . '/' . 'voiceRecording' . time() . substr(time(), 5) . '.ogg';
            }
        }
        if (!empty($video)) {
            $videoData = base64_decode($video);
            $videoPath = $upload_dir['path'] . '/' . 'videoRecording' . time() . substr(time(), 5) . '.mp4';
            if (file_put_contents($videoPath, $videoData)) {
                $videoUrl = $upload_dir['url'] . '/' . 'videoRecording' . time() . substr(time(), 5) . '.mp4';
            }
        }
        if (!empty($message) || !empty($attachments || !empty($audioUrl) || !empty($videoUrl))) {
            send_chat_message($sender_id, $receiver_id, $message, $attachments, $audioUrl, $videoUrl);
            wp_send_json_success('Message sent successfully');
        } else {
            wp_send_json_error('Message Not Sent');
        }
    } else {
        wp_send_json_error('Invalid parameters');
    }
    wp_die();
}

add_action('wp_ajax_send_chat_message', 'handle_send_chat_message');
add_action('wp_ajax_nopriv_send_chat_message', 'handle_send_chat_message');
function send_chat_message($sender_id, $receiver_id, $message, $attachments, $audioUrl, $videoUrl)
{

    $firebase = (new Factory)
        ->withServiceAccount(FIREBASE_PLUGIN_PATH . 'firebase-credentials.json')
        ->withDatabaseUri('https://my-chatbot-project-48653-default-rtdb.asia-southeast1.firebasedatabase.app/')
        ->createDatabase();

    date_default_timezone_set('Asia/Kolkata');
    $date = new DateTime();
    $formatted_date = $date->format('d/m/Y');
    $formatted_time = $date->format('h:i A');
    $unique_id = $sender_id . '-' . $receiver_id . substr(time(), 3) . time();

    $message_data = [
        'message' => $message,
        'sendDate' => $formatted_date,
        'time' => time(),
        'strTime' => $formatted_time,
        'senderId' => $sender_id,
        'receiverId' => $receiver_id,
        'seenBy' => 0,
        'attachments' => $attachments,
        'unique_id' => $unique_id,
        'video_recording' => $videoUrl,
        'voice_recording' => $audioUrl,
    ];


    $path_sender = 'chats/' . $sender_id . '/' . $sender_id . '_to_' . $receiver_id;
    $path_receiver = 'chats/' . $receiver_id . '/' . $receiver_id . '_to_' . $sender_id;

    $firebase->getReference($path_sender)->push($message_data);
    $firebase->getReference($path_receiver)->push($message_data);
}


add_action('wp_ajax_load_messages', 'handle_load_messages');
add_action('wp_ajax_nopriv_load_messages', 'handle_load_messages');
function handle_load_messages()
{
    if (isset($_POST['senderId']) && isset($_POST['receiverId'])) {
        $sender_id = sanitize_text_field($_POST['senderId']);
        $receiver_id = sanitize_text_field($_POST['receiverId']);


        $firebase = (new Factory)
            ->withServiceAccount(FIREBASE_PLUGIN_PATH . 'firebase-credentials.json')
            ->withDatabaseUri('https://my-chatbot-project-48653-default-rtdb.asia-southeast1.firebasedatabase.app/')
            ->createDatabase();


        $path = 'chats/' . $sender_id . '/' . $sender_id . '_to_' . $receiver_id;
        $messagesSnapshot = $firebase->getReference($path)->getSnapshot();
        $messages = $messagesSnapshot->getValue();
        if ($messages) {
            wp_send_json_success($messages);
        } else {
            wp_send_json_error('No messages found.');
        }
    } else {
        wp_send_json_error('Missing sender or receiver ID.');
    }

    wp_die();
}



add_action('wp_ajax_chat_list', 'chat_list');
add_action('wp_ajax_nopriv_chat_list', 'chat_list');
function chat_list()
{
    $user = wp_get_current_user();
    $userId = $user->ID;
    $firebase = (new Factory)
        ->withServiceAccount(FIREBASE_PLUGIN_PATH . 'firebase-credentials.json')
        ->withDatabaseUri('https://my-chatbot-project-48653-default-rtdb.asia-southeast1.firebasedatabase.app/')
        ->createDatabase();
    $path = 'chats/' . $userId;
    $messagesSnapshot = $firebase->getReference($path)->getSnapshot();
    $chats = $messagesSnapshot->getValue();

    ob_start();
    include plugin_dir_path(__FILE__) . 'view/chat-list.php';
    wp_die();
    return ob_get_clean();
}
