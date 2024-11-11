-- SQLite

CREATE TABLE Professors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rank TEXT NOT NULL
);

DROP TABLE Professors;

SELECT * FROM students;

INSERT INTO Professors (name, rank)
    VALUES ('Esmir Pilav', 'Redovni');