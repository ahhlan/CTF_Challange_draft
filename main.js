
// This function would be called when the user inputs the public key
function attemptDecryption(inputPublicKey) {
    // Get the encrypted flag
    const encryptedFlagElement = document.getElementById('encrypted-flag');
    const encryptedFlag = encryptedFlagElement.getAttribute('data-encrypted');
    
    // Convert base64 back to array buffer
    const encryptedData = base64ToArrayBuffer(encryptedFlag);
    
    // Import the public key
    window.crypto.subtle.importKey(
        "spki",
        base64ToArrayBuffer(inputPublicKey),
        {
            name: "RSA-OAEP",
            hash: {name: "SHA-256"},
        },
        false, // not extractable
        ["decrypt"]
    ).then(publicKey => {
        // Decrypt the flag
        return window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            publicKey,
            encryptedData
        );
    }).then(decrypted => {
        // Convert array buffer to string
        const decoder = new TextDecoder();
        const flag = decoder.decode(decrypted);
        
        // Display the flag to the user
        encryptedFlagElement.innerHTML = `<div class="success">Congratulations! You found the flag: ${flag}</div>`;
    }).catch(error => {
        console.error('Decryption failed:', error);
        encryptedFlagElement.innerHTML += '<div class="error">Incorrect key. Try again.</div>';
    });
}

// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

document.addEventListener('DOMContentLoaded', function() {
    // Only execute on index.html
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        setupFirstPage();
    }
});

function setupFirstPage() {
    // Create and encode the hint to the second page
    const hintText = "Navigate to page2.html to find the next clue";
    const encodedHint = btoa(hintText); // Base64 encode
    
    // Add the encoded hint to the page
    document.getElementById('encoded-hint').textContent = encodedHint;
    
    // Create and add the encrypted flag
    const flag = "flag{y0u_f0und_th3_s3cr3t_fl4g}";
    encryptFlag(flag).then(encryptedFlag => {
        document.querySelector('.hidden-content').innerHTML = 
            `<div id="encrypted-flag" data-encrypted="${encryptedFlag}">
                This text contains an encrypted flag. You'll need the public key to decrypt it.
            </div>`;
    });
}

 
document.addEventListener('DOMContentLoaded', function() {
    // Only execute on the second page
    if (window.location.pathname.includes('page2.html')) {
        createSecretButton();
    }
});

function createSecretButton() {
    const container = document.getElementById('secret-button-container');
    const button = document.createElement('button');
    
    button.className = 'secret-button';
    button.id = 'secretBtn';
    
    // Position it at a random location on the page
    const randomX = Math.floor(Math.random() * (window.innerWidth - 50));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 50));
    
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
    
    button.addEventListener('click', revealPublicKey);
    
    container.appendChild(button);
}

document.addEventListener('DOMContentLoaded', function() {
    createSecretButton();  // Call your function here
});

function revealPublicKey() {
    // Create container for the public key
    const keyContainer = document.createElement('div');
    keyContainer.className = 'public-key-container';
    keyContainer.style.display = 'block';
    
    // Add the public key content
    keyContainer.innerHTML = `
        <h3>You've found the secret button!</h3>
        <p>Here's the public key you need:</p>
        <pre id="public-key">${publicKey}</pre>
        <p>Go back to the first page and use this key to reveal the flag.</p>
    `;
    
    document.querySelector('.container').appendChild(keyContainer);
}

document.getElementById('decrypt-button').addEventListener('click', function() {
    const inputKey = document.getElementById('public-key-input').value.trim();
    if (inputKey) {
        attemptDecryption(inputKey);
    } else {
        alert('Please paste a public key first.');
    }
});