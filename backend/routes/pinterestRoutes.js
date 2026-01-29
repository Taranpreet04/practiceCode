const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PinterestToken = require('../model/pinterestToken');

const CLIENT_ID = process.env.PINTEREST_APP_ID;
const CLIENT_SECRET = process.env.PINTEREST_APP_SECRET;
const REDIRECT_URI = process.env.PINTEREST_REDIRECT_URI;

// 1. Login Route - Redirect to Pinterest OAuth
router.get('/login', (req, res) => {
    const scope = 'pins:read,boards:read,user_accounts:read';
    const authUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
    console.log("authUrl", authUrl);
    res.redirect(authUrl);
});

// 2. Callback Route - Exchange code for tokens
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    console.log("code", code);
    if (!code) return res.status(400).send('Authorization code missing');

    try {
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const response = await axios.post('https://api.pinterest.com/v5/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI
            }).toString(),
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log("response in callback", response);
        const { access_token, refresh_token, expires_in } = response.data;
        const expiresAt = new Date(Date.now() + expires_in * 1000);

        // For now, using a hardcoded userId or extracting from somewhere if available
        // In a real app, you'd get this from session/JWT
        const userId = req.query.state || '66e9a6e6e6e6e6e6e6e6e6e6'; // Placeholder if no user session

        await PinterestToken.findOneAndUpdate(
            { userId },
            { accessToken: access_token, refreshToken: refresh_token, expiresAt },
            { upsert: true, new: true }
        );

        res.send('Pinterest connected successfully! You can close this window.');
    } catch (error) {
        console.error('Pinterest Callback Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to connect Pinterest' });
    }
});

// Helper to get fresh token
async function getAccessToken(userId) {
    const token = await PinterestToken.findOne({ userId });
    if (!token) throw new Error('No Pinterest account connected');

    if (new Date() > token.expiresAt) {
        // Refresh token
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const response = await axios.post('https://api.pinterest.com/v5/oauth/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken
            }).toString(),
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, expires_in } = response.data;
        token.accessToken = access_token;
        token.expiresAt = new Date(Date.now() + expires_in * 1000);
        await token.save();
    }
    return token.accessToken;
}

// 3. Fetch Boards
router.get('/boards', async (req, res) => {
    const userId = req.query.userId || '66e9a6e6e6e6e6e6e6e6e6e6'; // Placeholder
    try {
        const accessToken = await getAccessToken(userId);
        const response = await axios.get('https://api.pinterest.com/v5/boards', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Fetch Boards Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch boards' });
    }
});

// 4. Fetch Pins in a Board
router.get('/boards/:boardId/pins', async (req, res) => {
    const { boardId } = req.params;
    const userId = req.query.userId || '66e9a6e6e6e6e6e6e6e6e6e6'; // Placeholder
    try {
        const accessToken = await getAccessToken(userId);
        const response = await axios.get(`https://api.pinterest.com/v5/boards/${boardId}/pins`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Fetch Pins Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch pins' });
    }
});

// 5. Import Pins
router.post('/import', async (req, res) => {
    const { pins, userId = '66e9a6e6e6e6e6e6e6e6e6e6' } = req.body;
    if (!pins || !Array.isArray(pins)) return res.status(400).json({ error: 'No pins provided' });

    try {
        const accessToken = await getAccessToken(userId);
        const imported = [];

        for (const pinId of pins) {
            // Get Pin Details
            const pinRes = await axios.get(`https://api.pinterest.com/v5/pins/${pinId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const imageUrl = pinRes.data.media.images['originals'].url;

            // Download Image
            const imgRes = await axios({
                url: imageUrl,
                method: 'GET',
                responseType: 'stream'
            });

            const fileName = `pinterest_${Date.now()}_${pinId}.jpg`;
            const filePath = path.join(__dirname, '../uploads', fileName);

            const writer = fs.createWriteStream(filePath);
            imgRes.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            imported.push({
                pinId,
                url: `http://localhost:5000/uploads/${fileName}`,
                originalUrl: imageUrl
            });
        }

        res.json({ message: 'Imported successfully', count: imported.length, imported });
    } catch (error) {
        console.error('Import Pins Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to import pins' });
    }
});

module.exports = router;
