from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth
from routes.user import user

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change this if your frontend URL is different
    allow_credentials=True,  # Allows sending cookies
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth, prefix="/auth")
app.include_router(user, prefix="/users")

@app.get("/")
async def root():
    return {"message": "JWT Authentication with MongoDB"}
