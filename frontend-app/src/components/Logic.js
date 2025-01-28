
const start_time = process.env.REACT_APP_START_TIME

export const time_to_num = (time) => parseInt(time.split(":")[0])

const startHour = time_to_num(start_time); // Extract the hour from the start_time
export const num_to_time = (num) => `${startHour + num}:00`

export const getHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found, user is not authenticated.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

}



const isConflict = (startTime, endTime, startIndex, endIndex) => {
    const startTemp = time_to_index(startTime)
    const endTemp = time_to_index(endTime)
    return (endTemp >= startIndex && endTemp <= endIndex) || (startTemp <= endIndex && startTemp >= startIndex) || (endIndex >= startTemp && endIndex <= endTemp) || (startIndex >= startTemp && startIndex <= endTemp)
}



export const time_to_index = (time) => time_to_num(time) - time_to_num(start_time)

export const getAvailableClassroomsForProfessor = (allCourses, allClassrooms, selectedCourse, rowIndex, colIndex)=>{

  let classroomIdsToRemove = selectedCourse.courseCanNotUseClassrooms.map((c)=>c.classroomId)

  let classroomIds = allClassrooms.map((c)=>c.id)

  let classroomIdsThatHaveLessons = allCourses.filter((c)=>c.lessons.length > 0 && c.lessons[0].day == colIndex && isConflict(c.lessons[0].startTime, c.lessons[0].endTime, rowIndex, rowIndex + selectedCourse.lectureSlotLength - 1) && c.id != selectedCourse.id).map((c) => c.lessons[0].classroomId)

  classroomIdsToRemove = [... new Set([...classroomIdsToRemove, ...classroomIdsThatHaveLessons])]


  classroomIds = classroomIds.filter(x => !classroomIdsToRemove.includes(x));

  return allClassrooms.filter((c) => classroomIds.includes(c.id))
}

export const getAvailableClassroomsForGroup = (allCourses, allClassrooms, selectedCourse, rowIndex, colIndex)=>{
  let classroomIds = allClassrooms.map((c)=>c.id)
  let classroomIdsToRemove = selectedCourse.courseCanNotUseClassrooms.map((c)=>c.classroomId)

  let classroomIdsThatHaveLessons = allCourses.filter((c)=>c.lessons.length > 0 && c.lessons[0].day == colIndex && isConflict(c.lessons[0].startTime, c.lessons[0].endTime, rowIndex, rowIndex + selectedCourse.lectureSlotLength - 1) && c.id != selectedCourse.id).map((c) => c.lessons[0].classroomId)
  classroomIds = classroomIds.filter(x => (!classroomIdsThatHaveLessons.includes(x)) && (!classroomIdsToRemove.includes(x)));

  return allClassrooms.filter((c) => classroomIds.includes(c.id))

}

export const groupHasCourses = (allCourses, studentGroup, rowIndex, endIndex, colIndex, item)=>{
  let courseIds = studentGroup.groupTakesCourses.map((c)=>c.courseId)
  let courses = allCourses.filter((c) => courseIds.includes(c.id) && c.id != item.id)
  courses = courses.filter((c) => c.lessons.length > 0)
  courses = courses.filter((c) => c.lessons[0].day == colIndex && isConflict(c.lessons[0].startTime, c.lessons[0].endTime, rowIndex, endIndex))
  return courses.length != 0
}


export const testSpot = (item, rowIndex, colIndex, allCourses, allClassrooms, allProfessors, allStudentGroups, professor, classroom, studentGroup, content) => {

  // Provjeri ima li dovoljno prostora za predmet na novoj poziciji
  for (let i = 0; i < item.lectureSlotLength; i++)
    if (rowIndex + i >= content.length || content[rowIndex + i][colIndex]) {
      return false;
    }

  let classrooms = []
  if(professor){
    classrooms = getAvailableClassroomsForProfessor(allCourses, allClassrooms, item, rowIndex, colIndex)
  }
  if(studentGroup){
    classrooms = getAvailableClassroomsForGroup(allCourses, allClassrooms, item, rowIndex, colIndex)
  }
  if (classrooms.length == 0 && !classroom){
    return false
  }
  //samo ako se profesor selecta ovo radi
  if(professor){
    let currentProfessorUnavailabilites = allProfessors.find((p)=> p.id == item.professorId).professorUnavailabilities.filter((a) => a.day == colIndex)
    if(currentProfessorUnavailabilites){
        let a = currentProfessorUnavailabilites.find((p) => isConflict(p.startTime, p.endTime, rowIndex, rowIndex + item.lectureSlotLength - 1))
        if (a){
          return false
        }
      }
  }

  let groups = item.groupTakesCourses.map((g) => g.studentGroupId)
  groups = allStudentGroups.filter((g) => groups.includes(g.id))
  const result = groups.some((g) => 
    groupHasCourses(allCourses, g, rowIndex, rowIndex + item.lectureSlotLength - 1, colIndex, item)
  );
  
  if (result) {
    return false; // Exit if any group satisfies the condition
  }
  return true
}