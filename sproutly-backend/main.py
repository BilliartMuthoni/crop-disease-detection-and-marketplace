from fastapi import FastAPI

from app.routers.auth import router as auth_router

#create a web server
app = FastAPI()

app.include_router(auth_router)

@app.get("/")
def message():
    print("Server running")
    return("Server running")
