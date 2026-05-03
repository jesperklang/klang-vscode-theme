-- SQL sample: DDL, constraints, CTEs, windows, JSON, and transactions
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS theme_preview (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug VARCHAR(80) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    accent CHAR(7) NOT NULL CHECK (accent LIKE '#______'),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO theme_preview (slug, title, accent, metadata)
VALUES
    ('klang-dark', 'Klang Dark', '#ff55c8', '{"contrast": "high", "enabled": true}'),
    ('cyan-info', 'Cyan Info', '#00f0ff', '{"contrast": "high", "enabled": false}');

WITH ranked AS (
    SELECT
        slug,
        title,
        accent,
        ROW_NUMBER() OVER (PARTITION BY accent ORDER BY created_at DESC) AS position
    FROM theme_preview
    WHERE title ILIKE '%klang%' OR metadata IS NOT NULL
)
SELECT slug, title, accent
FROM ranked
WHERE position = 1
ORDER BY title ASC;

COMMIT;
