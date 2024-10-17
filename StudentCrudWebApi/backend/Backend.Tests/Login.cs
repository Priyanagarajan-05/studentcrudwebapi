using backend.Controllers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Tests
{
    public class Login
    {

        [Fact]
        public void Login_ShouldReturnUnauthorized_WhenEmailNotFound()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "nonexistent@student.com",
                Password = "password123"
            };

            // Act
            var result = _authController.Login(loginRequest);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public void Login_ShouldReturnToken_WhenValidCredentials()
        {
            // Arrange
            var student = new Student
            {
                Name = "Test Student",
                Email = "test@student.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password123")
            };

            _dbContextMock.Object.Students.Add(student);
            _dbContextMock.Object.SaveChanges();

            var loginRequest = new LoginRequest
            {
                Email = "test@student.com",
                Password = "password123"
            };

            // Act
            var result = _authController.Login(loginRequest) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Contains("Token", result.Value.ToString());
        }
    }
}