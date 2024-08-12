import {StreamChat} from 'stream-chat';

const streamClient = StreamChat.getInstance('hz2xyte2s5ug', 'enuqryuvp7gkfm6895aqdafr9wkqrhq4wd877rzrwjsrbrc7dc8dgp7nte8n8k8m');

const generateStreamToken = (username) => {
    return streamClient.createToken(username.toString());
};

export default {generateStreamToken};
