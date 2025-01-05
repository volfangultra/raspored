const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isConflict = (start1, end1, start2, end2) => (start1 > start2 && start1 < end2) || (end1 > start1 && end1 < end2);

export const AddLesson = (course_id, classroom_id, day, startTime, endTime)=> {
  const storedData = JSON.parse(localStorage.getItem('schedule_data'));

  // Validate that course_id exists
  const course = storedData.courses.find((c) => c.id === course_id);
  if (!course) 
    return (false, 'Course with the provided ID does not exist.');

  // Validate that classroom_id exists
  const classroom = storedData.classrooms.find((c) => c.id === classroom_id);
  if (!classroom) 
    return (false, 'Classroom with the provided ID does not exist.');
    

  // Validate day is an integer between 0 and 4
  if (day < 0 || day > 4) 
    return (false, 'Day must be an integer between 0 and 4.');
    

  // Validate startTime and endTime format and values
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);


  if (startMinutes >= endMinutes) 
    return (false, 'End time must be later than start time.');
    

  // Validate lesson length matches the lectureSlotLength
  const lessonLength = (endMinutes - startMinutes) / 60;
  if (lessonLength !== course.lectureSlotLength) 
    return (false, `Lesson length must be ${course.lectureSlotLength} hours.`);

  // Validate if course already has a lesson
  if(course.lesson.length > 0)
    return (false, 'Course may only have one lesson');

    
  // Validate if professor is available in between startTime and EndTime
  const professorAvailability = course.professor.professorAvailabilities.find(
    (pa) => pa.day === day && timeToMinutes(pa.startTime) <= startMinutes && timeToMinutes(pa.endTime) >= endMinutes
  );

  if (!professorAvailability)
    return (false, 'Professor is not available at this time.');


  // Validate if professor doesn't have other lessons between startTime and EndTime
  const professorLessons = storedData.courses.flatMap((c) =>
    c.lesson.filter((l) => l.day === day &&
        c.professor.id === course.professor.id && 
        isConflict(timeToMinutes(l.startTime), timeToMinutes(l.endTime), startMinutes, endMinutes))
  );

  if (professorLessons.length != 0)
    return (false, 'Professor has lessons at that time');

  // Validate if classroom is free between startTime and EndTime
  const classroomLessons = storedData.courses.flatMap((c) =>
    c.lesson.filter((l) => l.day === day && 
        l.classroomId === classroom_id &&
        isConflict(timeToMinutes(l.startTime), timeToMinutes(l.endTime), startMinutes, endMinutes))
  );

  if(classroomLessons.length != 0)
    return (false, 'Classroom is taken at that time');


  // Validate if all study groups connected to this course do not have other lessons between startTime and endTime
  const studyGroups = course.groupTakesCourse.map((gtc) => gtc.studentGroupId);
  const groupConflicts = storedData.courses.flatMap((c) =>
    c.lesson.filter(
      (l) =>
        l.day === day &&
                c.groupTakesCourse.some((gtc) => studyGroups.includes(gtc.studentGroupId)) &&
                isConflict(timeToMinutes(l.startTime), timeToMinutes(l.endTime), startMinutes, endMinutes)
    )
  );

  if(groupConflicts.length != 0)
    return (false, 'Students have a lesson at that time');

  const newLesson = {
    day,
    startTime,
    endTime,
    classroomId: classroom_id
  };

  course.lesson.push(newLesson);
  return (true, 'Lesson inserted');

};


export const GetProfessors = () => {
  const storedData = JSON.parse(localStorage.getItem('schedule_data'));
  const professors =  storedData.courses.map((c)=>c.professor).
    filter((item, index, self) => 
      self.findIndex(other => other.id === item.id) === index
    );
  return professors;
};


export const GetClassrooms = () => {
  const storedData = JSON.parse(localStorage.getItem('schedule_data'));
  const classrooms = storedData.courses
    .map((c)=>c.canUseClassroom)
    .flat()
    .filter((item, index, self) => 
      self.findIndex(other => other.id === item.id) === index
    );
  return classrooms;
};


export const GetCourses = () => {
  const storedData = JSON.parse(localStorage.getItem('schedule_data'));
  return storedData.courses;
};


export const GetStudentGroups = () => {
  const storedData = JSON.parse(localStorage.getItem('schedule_data'));
  const studentGroups = storedData.courses
    .map((c)=>c.groupTakesCourse)
    .flat()
    .filter((item, index, self) => 
      self.findIndex(other => other.id === item.id) === index
    );
  return studentGroups;
};

// Get professor avaliable times
export const GetProfessorAvailableTimes = (professorId) => {
  const storedData = JSON.parse(localStorage.getItem('schedule_data'));
  const professor = storedData.courses.map((c)=>c.professor)
    .find((professor) => professor.id === professorId);
  if(!professor)
    return {};

  const availabilites = professor.professorAvailabilities;
  const lessons = storedData.courses
    .filter((c) => (c.professor.id == professorId))
    .map((c) => c.lesson);

  return {'Availabilities': availabilites, 'Lessons': lessons};

};

// Get Student Groups unavalable times
//Pitaj kakav format da vracas

// Get Classrooms unavailable times