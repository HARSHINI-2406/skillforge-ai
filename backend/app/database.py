import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Default to SQLite for easy local setup, but support PostgreSQL via environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./skillforge.db")

if DATABASE_URL.startswith("sqlite"):
    # SQLite requires connect_args for multithreading
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
