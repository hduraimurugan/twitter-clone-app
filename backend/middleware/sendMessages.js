// const axios = require('axios');
// const dotenv = require('dotenv');
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({})

// Replace with your actual Discord Webhook URL
const webhookURL = process.env.WEBHOOK_URL;

// Function to send login message to Discord
export const sendDiscordNotificationLogin = (username) => {
    const message = {
        content: `🚀 ${username} just logged into the Twitter Clone site!`
    };

    // Send the POST request to Discord webhook using axios
    axios.post(webhookURL, message)
        .then(response => {
            console.log('Login notification sent to Discord:', response.status);
        })
        .catch(error => {
            console.error('Error sending Discord notification:', error);
        });
}

export const sendDiscordNotificationLogout = (username) => {
    const message = {
        content: `🚀 ${username} just logged out of the Twitter Clone site!`
    };

    // Send the POST request to Discord webhook using axios
    axios.post(webhookURL, message)
        .then(response => {
            console.log('Logout notification sent to Discord:', response.status);
        })
        .catch(error => {
            console.error('Error sending Discord notification:', error);
        });
}

export const sendDiscordNotificationSignup = (username) => {
    const message = {
        content: `🚀 ${username} has signed up as a new User in the Twitter Clone site!`
    };

    // Send the POST request to Discord webhook using axios
    axios.post(webhookURL, message)
        .then(response => {
            console.log('Logout notification sent to Discord:', response.status);
        })
        .catch(error => {
            console.error('Error sending Discord notification:', error);
        });
}


