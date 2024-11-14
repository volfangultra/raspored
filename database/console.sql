-- SQLite

CREATE TABLE professors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rank TEXT NOT NULL
);

DROP TABLE classrooms;

SELECT * FROM classrooms;

INSERT INTO professors (name, rank)
    VALUES ('Esmir Pilav', 'Redovni');

-- ------------------------------------------

CREATE TABLE classrooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    have_pcs BOOLEAN NOT NULL
);


DROP TABLE classrooms;

SELECT * FROM classrooms;

INSERT INTO classrooms (name, capacity, have_pcs)
    VALUES ('Amfiteatar Branko Galeb', 160, True);