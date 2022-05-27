from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .fake_data import create_fake_data
from .routers import (
    assignments,
    auth,
    comments,
    constraints,
    customers,
    employees,
    inspections,
    regions,
    users,
)

Base.metadata.create_all(bind=engine)

create_fake_data()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(employees.router)
app.include_router(users.router)
app.include_router(regions.router)
app.include_router(customers.router)
app.include_router(inspections.router)
app.include_router(comments.router)
app.include_router(auth.router)
app.include_router(assignments.router)
app.include_router(constraints.router)


@app.get("/")
def root():
    return {"message": "Krankontroll AS"}
