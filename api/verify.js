// api/verify.js - Vercel Serverless Function for Key Verification

export default async function handler(req, res) {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { key } = req.query;

        // Check if key is provided
        if (!key) {
            return res.status(400).json({
                success: false,
                message: 'No key provided',
                valid: false
            });
        }

        // Basic key validation (you can enhance this)
        const isValidFormat = key.startsWith('KEY_') && key.length > 10;
        
        if (!isValidFormat) {
            return res.status(400).json({
                success: false,
                message: 'Invalid key format',
                valid: false
            });
        }

        // Extract timestamp from key to check expiration (24 hours)
        try {
            const keyParts = key.split('_');
            if (keyParts.length >= 2) {
                const timestamp = parseInt(keyParts[1]);
                const currentTime = Date.now();
                const keyAge = currentTime - timestamp;
                const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

                if (keyAge > twentyFourHours) {
                    return res.status(400).json({
                        success: false,
                        message: 'Key has expired',
                        valid: false,
                        expired: true
                    });
                }
            }
        } catch (timestampError) {
            console.error('Error parsing timestamp:', timestampError);
        }

        // In a real implementation, you would check against a database
        // For now, we'll accept any properly formatted key that hasn't expired
        
        // Simulate database lookup
        const keyExists = await simulateKeyLookup(key);

        if (keyExists) {
            res.status(200).json({
                success: true,
                message: 'Key is valid',
                valid: true,
                key: key,
                timestamp: Date.now()
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Key not found',
                valid: false
            });
        }

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            valid: false,
            error: error.message
        });
    }
}

// Simulate database lookup (replace with real database in production)
async function simulateKeyLookup(key) {
    // In a real app, this would query your database
    // For demo purposes, accept any key that follows the correct format
    return key.startsWith('KEY_') && key.length > 10;
}

// Example usage in Roblox Lua:
/*
local HttpService = game:GetService("HttpService")
local key = "YOUR_GENERATED_KEY"
local url = "https://your-vercel-app.vercel.app/api/verify?key=" .. key

local success, result = pcall(function()
    return HttpService:GetAsync(url)
end)

if success then
    local data = HttpService:JSONDecode(result)
    if data.valid then
        print("Key is valid! Access granted.")
        -- Your script logic here
    else
        print("Invalid key: " .. data.message)
        -- Handle invalid key
    end
else
    print("Error checking key: " .. result)
end
*/
