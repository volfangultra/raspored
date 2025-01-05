
DELETE FROM Users WHERE Id = 3;

INSERT INTO Users VALUES (3, "nedo", "nedo@gmail.com", "$2a$11$kKJSXfErxt7CSP93Dr8ZdeWz9swQb/1caIC/ZIFZDaYhE9R0XJXZ.", "user");


INSERT INTO Schedules (Id, UserId, Name, Semester) VALUES
(1, 1, 'Fall 2025 Schedule', 'Fall 2025'),
(2, 2, 'Spring 2026 Schedule', 'Spring 2026');

-- Insert professors
INSERT INTO Professors (Id, Name, Rank) VALUES
(1, 'Dr. Alice Johnson', 'Associate Professor'),
(2, 'Dr. Bob Williams', 'Professor');

-- Insert professor availability
INSERT INTO ProfessorAvailability (Id, ProfessorId, day, StartTime, EndTime) VALUES
(1, 1, 0, '09:00:00', '14:00:00'), -- Monday
(2, 2, 1, '10:00:00', '16:00:00'); -- Tuesday

-- Insert student groups
INSERT INTO StudentGroups (Id, Major, Year, Name) VALUES
(1, 'Computer Science', 2, 'CS-2025'),
(2, 'Mechanical Engineering', 3, 'ME-2024');

-- Insert courses
INSERT INTO Courses (Id, ScheduleId, Name, Type, ProfessorId, LectureSlotLength) VALUES
(1, 1, 'Data Structures', 'Lecture', 1, 3),
(2, 1, 'Thermodynamics', 'Lecture', 2, 3);

-- Insert group takes courses
INSERT INTO GroupTakesCourses (Id, StudentGroupId, CourseId) VALUES
(1, 1, 1),
(2, 1, 2);

-- Insert classrooms
INSERT INTO Classrooms (Id, ScheduleID, Name, Floor) VALUES
(1, 1, 'CS101', 1),
(2, 1, 'ME202', 2);

-- Insert course can use classroom
INSERT INTO CourseCanUserClassroom (Id, CourseId, ClassroomId) VALUES
(1, 1, 1),
(2, 2, 2);

-- Insert lessons
INSERT INTO Lessons (Id, CourseId, ClassroomId, Day, StartTime, EndTime) VALUES
(1, 1, 1, 1, '09:00:00', '12:00:00'), -- Monday