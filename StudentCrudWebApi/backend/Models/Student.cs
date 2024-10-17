using System;

namespace backend.Models
{
    public class Student
    {
        public int Id { get; set; } // Auto-increment
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public DateTime DOB { get; set; }
    }
}
