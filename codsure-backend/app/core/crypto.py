from cryptography.fernet import Fernet
from app.core.config import settings
import base64
import os

# Ensure we have a valid fernet key. 
# In production, this should be a static env var ENCRYPTION_KEY.
# For this setup, we'll derive one from SECRET_KEY if not present, or generate one.
# Note: Changing SECRET_KEY will invalidate tokens if derived, so be careful.

def get_cipher_suite():
    key = settings.SECRET_KEY
    # Fernet requires a 32-byte url-safe base64 encoded key.
    # We'll just hash the secret key and encode it to ensure consistency.
    import hashlib
    digest = hashlib.sha256(key.encode()).digest()
    fernet_key = base64.urlsafe_b64encode(digest)
    return Fernet(fernet_key)

def encrypt_token(token: str) -> str:
    if not token:
        return None
    cipher_suite = get_cipher_suite()
    encrypted_text = cipher_suite.encrypt(token.encode())
    return encrypted_text.decode()

def decrypt_token(encrypted_token: str) -> str:
    if not encrypted_token:
        return None
    cipher_suite = get_cipher_suite()
    decrypted_text = cipher_suite.decrypt(encrypted_token.encode())
    return decrypted_text.decode()
