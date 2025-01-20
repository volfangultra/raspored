export const fetchSchedules = async (userId) => {
  if (!userId) {
    console.error('UserId not found');
    return [];
  }
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/schedules/user/${userId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching schedules: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((schedule) => ({
      key: schedule.id,
      value: schedule.id,
      text: schedule.name,
    }));
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return [];
  }
};

export const fetchClassrooms = async (scheduleId = null) => {
  try {
    const scheduleQuery = scheduleId
      ? `?scheduleId=${scheduleId}`
      : `?scheduleId=${localStorage.getItem('scheduleId')}`;
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/classrooms${scheduleQuery}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch professors:', error);
    return [];
  }
};

export const fetchCourses = async (scheduleId = null) => {
  try {
    const scheduleQuery = scheduleId
      ? `?scheduleId=${scheduleId}`
      : `?scheduleId=${localStorage.getItem('scheduleId')}`;
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/courses${scheduleQuery}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
};

export const fetchStudentGroups = async (scheduleId = null) => {
  try {
    const scheduleQuery = scheduleId
      ? `?scheduleId=${scheduleId}`
      : `?scheduleId=${localStorage.getItem('scheduleId')}`;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/student-groups${scheduleQuery}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch student groups:', error);
    return [];
  }
};