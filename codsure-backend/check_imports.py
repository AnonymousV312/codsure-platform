import sys
import os

# Set mock env vars to prevent config validation errors during import
os.environ["DATABASE_URL"] = "postgresql://user:pass@localhost/db"
os.environ["SECRET_KEY"] = "mock_secret_key"
os.environ["SHOPIFY_API_KEY"] = "mock_api_key"
os.environ["SHOPIFY_API_SECRET"] = "mock_api_secret"

print("--> Starting Import Check...")
try:
    # Attempt to import the main application entry point.
    # This triggers imports of all routers, extensions, and models.
    from app import main
    print("--> SUCCESS: app.main imported without error.")
except Exception as e:
    print(f"--> FAILURE: Import failed with error: {e}")
    import traceback
    traceback.print_exc()
