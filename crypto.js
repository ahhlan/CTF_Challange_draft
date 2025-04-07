// In crypto.js
let privateKey, publicKey;

// Generate key pair
async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true, // extractable
        ["encrypt", "decrypt"]
    );
    
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
    
    // Export public key to display to users
    const exportedPublicKey = await window.crypto.subtle.exportKey(
        "spki",
        publicKey
    );
    
    // Convert to base64 for display
    const publicKeyBase64 = arrayBufferToBase64(exportedPublicKey);
    return publicKeyBase64;
}

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Function to encrypt the flag with the private key
async function encryptFlag(flag) {
    // First generate keys if not already generated
    if (!privateKey) {
        await generateKeyPair();
    }
    
    // Convert flag string to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(flag);
    
    // Encrypt with private key
    const encryptedFlag = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        data
    );
    
    // Convert to base64 for storage in HTML
    return arrayBufferToBase64(encryptedFlag);
}
