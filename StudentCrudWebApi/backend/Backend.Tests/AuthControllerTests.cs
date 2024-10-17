using backend.Controllers;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Tests
{
    public class AuthControllerTests
    {
        private readonly AuthController _authController;
        private readonly Mock<StudentDbContext> _dbContextMock;

        public AuthControllerTests()
        {
            // Mock the DbContext
            var options = new DbContextOptionsBuilder<StudentDbContext>()
                          .UseInMemoryDatabase(databaseName: "StudentDbTest")
                          .Options;
            _dbContextMock = new Mock<StudentDbContext>(options);

            // Mock IConfiguration for JWT
            var configurationMock = new Mock<IConfiguration>();
            configurationMock.Setup(c => c["Jwt:Key"]).Returns("fLzNnD37J3!Qw6^r2LnXyTqQZ8s!vR9e");

            // Initialize controller with mocked dependencies
            _authController = new AuthController(_dbContextMock.Object, configurationMock.Object);
        }

        [Fact]
        public void Register_ShouldReturnBadRequest_WhenEmailIsEmpty()
        {
            // Arrange
            var student = new Student
            {
                Name = "Test Student",
                Email = "",
                Password = "password123"
            };

            // Act
            var result = _authController.Register(student);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void Register_ShouldCreateStudent_WhenValidData()
        {
            // Arrange
            var student = new Student
            {
                Name = "Test Student",
                Email = "test@student.com",
                Password = "password123",
                PhoneNumber = "1234567890",
                Department = "IT",
                DOB = new DateTime(2000, 1, 1)
            };

            // Act
            var result = _authController.Register(student);

            // Assert
            Assert.IsType<CreatedAtActionResult>(result);
        }
    }
}
