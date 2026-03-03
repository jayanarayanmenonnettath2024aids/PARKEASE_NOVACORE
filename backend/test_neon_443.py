import traceback
from sqlalchemy import create_engine

url = "postgresql://neondb_owner:npg_6XUh4gqAzGCS@ep-green-band-a1lz6n8q-pooler.ap-southeast-1.aws.neon.tech:443/neondb?sslmode=require"
engine = create_engine(url)

try:
    with engine.connect() as conn:
        print("Successfully connected to Neon Postgres via SNI Port 443!")
except Exception as e:
    print("Failed to connect on Port 443:")
    traceback.print_exc()
