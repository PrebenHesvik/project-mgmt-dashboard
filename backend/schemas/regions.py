from pydantic import BaseModel


class Region(BaseModel):
    region: str

    class Config:
        orm_mode = True
