import sqlite3
import os
from datetime import datetime

DATABASE_PATH = 'weather.db'

def init_db():
    """Initialize the database with required tables."""
    if os.path.exists(DATABASE_PATH):
        return
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS weather_searches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            county TEXT NOT NULL,
            temperature REAL,
            conditions TEXT,
            wind_speed REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DATABASE_PATH}")

def save_weather_search(county, temperature, conditions, wind_speed):
    """Save a weather search to the database."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO weather_searches (county, temperature, conditions, wind_speed)
            VALUES (?, ?, ?, ?)
        ''', (county, temperature, conditions, wind_speed))
        
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Database error: {e}")
        return False

def get_recent_searches(limit=10):
    """Retrieve recent weather searches."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT county, temperature, conditions, wind_speed, timestamp
            FROM weather_searches
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        return rows
    except Exception as e:
        print(f"Database error: {e}")
        return []
