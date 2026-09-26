"""
models.py
---------
Very small data-access layer around a single SQLite table called
"generations". Kept deliberately simple (plain sqlite3, no ORM) so it is
easy to read for a college project.
"""

import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "codecraft.db")


def get_connection():
    """Open a new SQLite connection with rows returned as dict-like objects."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the generations table if it does not already exist."""
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS generations (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt          TEXT NOT NULL,
            language        TEXT NOT NULL,
            generated_code  TEXT NOT NULL,
            explanation     TEXT,
            created_at      TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


def save_generation(prompt, language, generated_code, explanation):
    """Insert one successful generation and return its new id."""
    conn = get_connection()
    cursor = conn.execute(
        """
        INSERT INTO generations (prompt, language, generated_code, explanation, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (prompt, language, generated_code, explanation, datetime.utcnow().isoformat()),
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_all_generations():
    """Return every generation, newest first, WITHOUT the full code/explanation
    (keeps the history list endpoint light — the detail endpoint fetches the rest)."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, prompt, language, created_at FROM generations ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_generation_by_id(generation_id):
    """Return one full generation record, or None if it doesn't exist."""
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM generations WHERE id = ?", (generation_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None
