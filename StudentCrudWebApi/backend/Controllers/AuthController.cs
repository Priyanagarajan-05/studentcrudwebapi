/* -- perfect --*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly StudentDbContext _context;
      
        private readonly IConfiguration _configuration;
        public AuthController(StudentDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }



        // POST: api/auth/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] Student student)
        {
            if (string.IsNullOrWhiteSpace(student.Email) || string.IsNullOrWhiteSpace(student.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            if (_context.Students.Any(u => u.Email == student.Email))
            {
                return BadRequest("Email is already in use.");
            }

            student.Password = BCrypt.Net.BCrypt.HashPassword(student.Password);
            _context.Students.Add(student);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

       
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _context.Students.SingleOrDefault(u => u.Email == loginRequest.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
            {
                return Unauthorized();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]); // Retrieve from config

            if (tokenKey == null || tokenKey.Length == 0)
            {
                return StatusCode(500, "JWT Secret Key is not configured properly.");
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, "Student")
                }),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }




        // GET: api/auth/students
        [HttpGet("students")]
        public ActionResult<IEnumerable<Student>> GetStudents()
        {
            return Ok(_context.Students.ToList());
        }

        // GET: api/auth/students/{id}
        [HttpGet("students/{id}")]
        public ActionResult<Student> GetStudent(int id)
        {
            var student = _context.Students.Find(id);
            if (student == null)
            {
                return NotFound("Student not found.");
            }
            return Ok(student);
        }

        // PUT: api/auth/students/{id}
        [HttpPut("students/{id}")]
        public IActionResult UpdateStudent(int id, [FromBody] Student updatedStudent)
        {
            if (id != updatedStudent.Id)
            {
                return BadRequest("Student ID mismatch.");
            }

            var student = _context.Students.AsNoTracking().FirstOrDefault(s => s.Id == id);
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            // Ensure password is not unintentionally overwritten
            updatedStudent.Password = student.Password; // Retain the existing password

            _context.Entry(updatedStudent).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Error updating student.");
            }

            return NoContent();
        }

        // DELETE: api/auth/students/{id}
        [HttpDelete("students/{id}")]
        public IActionResult DeleteStudent(int id)
        {
            var student = _context.Students.Find(id);
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            _context.Students.Remove(student);
            _context.SaveChanges();
            return NoContent();
        }
    }
}

/*

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Controllers
{
    [Route("Auth")] // Changed the route to match the specified format
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly StudentDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(StudentDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: Auth/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] Student student)
        {
            if (string.IsNullOrWhiteSpace(student.Email) || string.IsNullOrWhiteSpace(student.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            if (_context.Students.Any(u => u.Email == student.Email))
            {
                return BadRequest("Email is already in use.");
            }

            student.Password = BCrypt.Net.BCrypt.HashPassword(student.Password);
            _context.Students.Add(student);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        // POST: Auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _context.Students.SingleOrDefault(u => u.Email == loginRequest.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
            {
                return Unauthorized();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]); // Retrieve from config

            if (tokenKey == null || tokenKey.Length == 0)
            {
                return StatusCode(500, "JWT Secret Key is not configured properly.");
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, "Student")
                }),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }

        // GET: Auth/students (not changed, but can be kept if needed)
        [HttpGet("students")]
        public ActionResult<IEnumerable<Student>> GetStudents()
        {
            return Ok(_context.Students.ToList());
        }

        // GET: Auth/students/{id} (if needed)
        [HttpGet("students/{id}")]
        public ActionResult<Student> GetStudent(int id)
        {
            var student = _context.Students.Find(id);
            if (student == null)
            {
                return NotFound("Student not found.");
            }
            return Ok(student);
        }

        // PUT: Auth/students/{id} (if needed)
        [HttpPut("students/{id}")]
        public IActionResult UpdateStudent(int id, [FromBody] Student updatedStudent)
        {
            if (id != updatedStudent.Id)
            {
                return BadRequest("Student ID mismatch.");
            }

            var student = _context.Students.AsNoTracking().FirstOrDefault(s => s.Id == id);
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            // Ensure password is not unintentionally overwritten
            updatedStudent.Password = student.Password; // Retain the existing password

            _context.Entry(updatedStudent).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Error updating student.");
            }

            return NoContent();
        }

        // DELETE: Auth/students/{id} (if needed)
        [HttpDelete("students/{id}")]
        public IActionResult DeleteStudent(int id)
        {
            var student = _context.Students.Find(id);
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            _context.Students.Remove(student);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
*/