from fastapi import FastAPI
from routes.auth import auth
from routes.user import user

app = FastAPI()

app.include_router(auth, prefix="/auth")
app.include_router(user, prefix="/users")

@app.get("/")
async def root():
    return {"message": "JWT Authentication with MongoDB"}
