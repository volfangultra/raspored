namespace ProjectNamespace.TimetableHelpers
{
    public static class TimetableHelper
    {
        private static readonly Dictionary<string, short> DayOfWeekWeekNumberMap = new()
        {
                { "Monday", 1 },
                { "Tuesday", 2 },
                { "Wednesday", 3 },
                { "Thursday", 4 },
                { "Friday", 5 },
                { "Saturday", 6 },
                { "Sunday", 7 },
        };

        private static readonly Dictionary<short, string> WeekNumberDayOfWeekMap = new()
        {
                { 1, "Monday" },
                { 2, "Tuesday" },
                { 3, "Wednesday" },
                { 4, "Thursday" },
                { 5, "Friday" },
                { 6, "Saturday" },
                { 7, "Sunday" },
        };

        public static List<int> AvailableDayTimes(List<KeyValuePair<short, short>> availableWeekDays)
        {
            var result = new List<int>();
            foreach (var availableWeekDay in availableWeekDays)
            {
                for (var i = 1; i <= availableWeekDay.Value; i++)
                {
                    result.Add((availableWeekDay.Key * 100) + i);
                }
            }

            return result;
        }

        public static string GetDayOfWeek(short weekNumber) => WeekNumberDayOfWeekMap[weekNumber];

        public static short GetWeekNumber(string dayOfWeek) => DayOfWeekWeekNumberMap[dayOfWeek];
    }
}
