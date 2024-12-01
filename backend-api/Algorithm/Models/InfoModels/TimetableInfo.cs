using System.Collections.Generic;
using System.Linq;
using ProjectNamespace.Models.Contracts;
using ProjectNamespace.Models.Info;
using ProjectNamespace.TimetableHelpers;

namespace ProjectNamespace.Models
{
    public class TimetableInfo
    {
        public List<StudyGroupInfo> StudyGroups { get; set; }

        public List<ProfessorInfo> Professors { get; set; }

        public List<LessonInfo> Lessons { get; set; }

        public List<StudyGroupAssignedLesson> StudyGroupAssignedLesson { get; set; }

        public List<ProfessorAssignedLesson> ProfessorAssignedLesson { get; set; }

        public List<TimeslotInfo> Timeslots { get; set; }

        public Timetable ToTimetable()
        {
            var studyGroups = this.StudyGroups.Select(s => new StudyGroupContract { Id = s.IdStudyGroup }).ToList();
            var professors = this.Professors.Select(s => new ProfessorContract { Id = s.IdProfessor }).ToList();
            var lessons = this.Lessons.Select(s => new LessonContract
            {
                Id = s.IdLesson,
                LessonsPerWeek = s.LessonsPerWeek,
                Timetable = s.Timetable.Select(x => new TimetableElementContract { DayOfWeek = x.DayOfWeek, LessonNumber = x.LessonNumber }).ToList(),
            }).ToList();
            var studyGroupAssignedLesson = this.StudyGroupAssignedLesson.Select(s => new StudyGroupAssignedLessonContract { IdLesson = s.IdLesson, IdStudyGroup = s.IdStudyGroup }).ToList();
            var professorAssignedTeachingGroups = this.ProfessorAssignedLesson.Select(s => new ProfessorAssignedLessonContract { IdProfessor = s.IdProfessor, IdLesson = s.IdLesson }).ToList();
            var timeslots = this.Timeslots.Select(s => new TimeslotsContract { DayOfWeek = s.DayOfWeek, NumberOfLessons = (short)s.NumberOfLessons }).ToList();

            var result = new Timetable(studyGroups, professors, lessons, studyGroupAssignedLesson, professorAssignedTeachingGroups, timeslots);
            return result;
        }

        public void UpdateTimetable(Timetable timetable)
        {
            foreach (var lessonInfo in this.Lessons)
            {
                lessonInfo.Timetable.Clear();
                var lessonGroup = timetable.Lessons.Single(s => s.ClassroomTimeslotId == lessonInfo.IdLesson);
                foreach (var dayTime in lessonGroup.Timetable)
                {
                    lessonInfo.Timetable.Add(new TimetableElement
                    {
                        DayOfWeek = TimetableHelper.GetDayOfWeek((short)(dayTime / 100)),
                        LessonNumber = dayTime % 10,
                    });
                }
            }
        }
    }
}
