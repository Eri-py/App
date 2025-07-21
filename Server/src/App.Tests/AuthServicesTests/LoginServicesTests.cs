using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.AuthServices.LoginServices;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace App.Tests.AuthServicesTests;

[TestFixture]
public class LoginServiceTest
{
    private Mock<IEmailService> _emailService;
    private Mock<IJwtService> _jwtService;
    private AppDbContext _context;
    private LoginService _loginService;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;

        _context = new AppDbContext(options);
        _context.Database.OpenConnection();
        _context.Database.EnsureCreated();

        _emailService = new Mock<IEmailService>();
        _jwtService = new Mock<IJwtService>();

        _loginService = new LoginService(_context, _emailService.Object, _jwtService.Object);
    }

    [TearDown]
    public async Task TearDown()
    {
        if (_context != null)
        {
            await _context.Database.GetDbConnection().DisposeAsync();
            await _context.DisposeAsync();
        }
    }

    private static User CreateUser(
        string username = "testuser",
        string email = "test@test.com",
        string? passwordHash = null,
        string? firstname = "Test",
        string? lastname = "User",
        DateOnly? dateOfBirth = null,
        DateTime? createdAt = null,
        string? otp = null,
        DateTime? otpExpiresAt = null
    )
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Username = username,
            Email = email,
            PasswordHash = passwordHash,
            Firstname = firstname,
            Lastname = lastname,
            DateOfBirth = dateOfBirth ?? new DateOnly(1990, 1, 1),
            CreatedAt = createdAt ?? DateTime.UtcNow,
            RefreshTokens = [],
            Otp = otp,
            OtpExpiresAt = otpExpiresAt,
        };
    }

    private static void AssertUsersEqual(User actual, User expected)
    {
        Assert.Multiple(() =>
        {
            Assert.That(actual.Id, Is.EqualTo(expected.Id));
            Assert.That(actual.Username, Is.EqualTo(expected.Username));
            Assert.That(actual.Email, Is.EqualTo(expected.Email));
            Assert.That(actual.Otp, Is.EqualTo(expected.Otp));
            Assert.That(actual.OtpExpiresAt, Is.EqualTo(expected.OtpExpiresAt));
            Assert.That(actual.PasswordHash, Is.EqualTo(expected.PasswordHash));
            Assert.That(actual.Firstname, Is.EqualTo(expected.Firstname));
            Assert.That(actual.Lastname, Is.EqualTo(expected.Lastname));
            Assert.That(actual.DateOfBirth, Is.EqualTo(expected.DateOfBirth));
            Assert.That(actual.CreatedAt, Is.EqualTo(expected.CreatedAt));
            Assert.That(actual.RefreshTokens, Has.Count.EqualTo(expected.RefreshTokens.Count));
        });
    }

    #region StartLoginAsync Tests

    [Test]
    public async Task StartLoginAsync_ValidCredentialsWithUsername_Success()
    {
        // Arrange
        var passwordHasher = new PasswordHasher<User>();
        var password = "Test@123";
        var hashedPassword = passwordHasher.HashPassword(CreateUser(), password);

        var existingUser = CreateUser(passwordHash: hashedPassword);
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new LoginRequest { Identifier = "testuser", Password = password };

        var otp = "123456";
        var expiresAt = DateTime.UtcNow.AddMinutes(5);

        _jwtService.Setup(x => x.CreateOtp(5)).Returns((otp, expiresAt));
        _emailService
            .Setup(x => x.SendEmailVerificationAsync("test@test.com", "testuser", otp, "5 minutes"))
            .ReturnsAsync(Result.NoContent());

        // Act
        var result = await _loginService.StartLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(result.Content, Is.EqualTo(expiresAt.ToString("o")));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(userAfterTest.Username, Is.EqualTo(existingUser.Username));
            Assert.That(userAfterTest.Email, Is.EqualTo(existingUser.Email));
            Assert.That(userAfterTest.Otp, Is.EqualTo(otp));
            Assert.That(userAfterTest.OtpExpiresAt, Is.EqualTo(expiresAt));
            Assert.That(userAfterTest.PasswordHash, Is.EqualTo(existingUser.PasswordHash));
            Assert.That(userAfterTest.Firstname, Is.EqualTo(existingUser.Firstname));
            Assert.That(userAfterTest.Lastname, Is.EqualTo(existingUser.Lastname));
            Assert.That(userAfterTest.DateOfBirth, Is.EqualTo(existingUser.DateOfBirth));
            Assert.That(userAfterTest.CreatedAt, Is.EqualTo(existingUser.CreatedAt));
            Assert.That(userAfterTest.RefreshTokens, Is.EqualTo(existingUser.RefreshTokens));
        });
    }

    [Test]
    public async Task StartLoginAsync_ValidCredentialsWithEmail_Success()
    {
        // Arrange
        var passwordHasher = new PasswordHasher<User>();
        var password = "Test@123";
        var hashedPassword = passwordHasher.HashPassword(CreateUser(), password);

        var existingUser = CreateUser(passwordHash: hashedPassword);
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new LoginRequest { Identifier = "TEST@TEST.COM", Password = password };

        var otp = "123456";
        var expiresAt = DateTime.UtcNow.AddMinutes(5);

        _jwtService.Setup(x => x.CreateOtp(5)).Returns((otp, expiresAt));
        _emailService
            .Setup(x => x.SendEmailVerificationAsync("test@test.com", "testuser", otp, "5 minutes"))
            .ReturnsAsync(Result.NoContent());

        // Act
        var result = await _loginService.StartLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(result.Content, Is.EqualTo(expiresAt.ToString("o")));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(userAfterTest.Username, Is.EqualTo(existingUser.Username));
            Assert.That(userAfterTest.Email, Is.EqualTo(existingUser.Email));
            Assert.That(userAfterTest.Otp, Is.EqualTo(otp));
            Assert.That(userAfterTest.OtpExpiresAt, Is.EqualTo(expiresAt));
            Assert.That(userAfterTest.PasswordHash, Is.EqualTo(existingUser.PasswordHash));
            Assert.That(userAfterTest.Firstname, Is.EqualTo(existingUser.Firstname));
            Assert.That(userAfterTest.Lastname, Is.EqualTo(existingUser.Lastname));
            Assert.That(userAfterTest.DateOfBirth, Is.EqualTo(existingUser.DateOfBirth));
            Assert.That(userAfterTest.CreatedAt, Is.EqualTo(existingUser.CreatedAt));
            Assert.That(userAfterTest.RefreshTokens, Is.EqualTo(existingUser.RefreshTokens));
        });
    }

    [Test]
    public async Task StartLoginAsync_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        var request = new LoginRequest
        {
            Identifier = "nonexistent@test.com",
            Password = "Test@123",
        };

        // Act
        var result = await _loginService.StartLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(
                result.Message,
                Is.EqualTo("Your login credentials don't match an account in our system.")
            );
        });
        var usersCount = await _context.Users.CountAsync();
        Assert.That(usersCount, Is.EqualTo(0));
    }

    [Test]
    public async Task StartLoginAsync_IncompleteRegistration_ReturnsBadRequest()
    {
        // Arrange
        var incompleteRegistrationUser = CreateUser(firstname: null, lastname: null);
        _context.Users.Add(incompleteRegistrationUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new LoginRequest { Identifier = "testuser", Password = "Test@123" };

        // Assert
        // Should throw null because password hash should be empty for incomplete registration
        Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await _loginService.StartLoginAsync(request)
        );
    }

    [Test]
    public async Task StartLoginAsync_InvalidPassword_ReturnsNotFound()
    {
        // Arrange
        var passwordHasher = new PasswordHasher<User>();
        var correctPassword = "Test@123";
        var hashedPassword = passwordHasher.HashPassword(CreateUser(), correctPassword);

        var existingUser = CreateUser(passwordHash: hashedPassword);
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new LoginRequest { Identifier = "testuser", Password = "WrongPassword@123" };

        // Act
        var result = await _loginService.StartLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(
                result.Message,
                Is.EqualTo("Your login credentials don't match an account in our system.")
            );
        });

        // Verify no OTP was set
        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        AssertUsersEqual(existingUser, userAfterTest);
    }

    [Test]
    public async Task StartLoginAsync_EmailSendingFails_RollsBack()
    {
        // Arrange
        var passwordHasher = new PasswordHasher<User>();
        var password = "Test@123";
        var hashedPassword = passwordHasher.HashPassword(CreateUser(), password);

        var existingUser = CreateUser(passwordHash: hashedPassword);
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new LoginRequest { Identifier = "testuser", Password = password };

        var otp = "123456";
        var expiresAt = DateTime.UtcNow.AddMinutes(5);

        _jwtService.Setup(x => x.CreateOtp(5)).Returns((otp, expiresAt));
        _emailService
            .Setup(x =>
                x.SendEmailVerificationAsync(
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>()
                )
            )
            .ReturnsAsync(Result.InternalServerError("Error sending email"));

        // Act
        var result = await _loginService.StartLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Error sending email"));
        });

        // Verify rollback - OTP should not be set
        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        AssertUsersEqual(existingUser, userAfterTest);
    }

    #endregion

    #region CompleteLoginAsync Tests

    [Test]
    public async Task CompleteLoginAsync_ValidOtp_ReturnsTokensAndClearsOtp()
    {
        // Arrange
        var existingUser = CreateUser(
            otp: "123456",
            otpExpiresAt: DateTime.UtcNow.AddMinutes(5),
            passwordHash: "hashed_password"
        );
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new VerifyOtpRequest { Email = "test@test.com", Otp = "123456" };

        var accessToken = "access_token";
        var accessTokenExpiresAt = DateTime.UtcNow.AddMinutes(15);
        var refreshToken = "refresh_token";
        var refreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);

        _jwtService
            .Setup(x => x.CreateRefreshToken(7))
            .Returns((refreshToken, refreshTokenExpiresAt));
        _jwtService
            .Setup(x => x.CreateAccessToken(It.IsAny<User>(), 15))
            .Returns((accessToken, accessTokenExpiresAt));
        _jwtService.Setup(x => x.HashToken(refreshToken)).Returns("hashed_refresh_token");

        // Act
        var result = await _loginService.CompleteLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(result.Content, Is.Not.Null);
        });
        Assert.Multiple(() =>
        {
            Assert.That(result.Content.AccessToken, Is.EqualTo(accessToken));
            Assert.That(result.Content.RefreshToken, Is.EqualTo(refreshToken));
            Assert.That(result.Content.AccessTokenExpiresAt, Is.EqualTo(accessTokenExpiresAt));
            Assert.That(result.Content.RefreshTokenExpiresAt, Is.EqualTo(refreshTokenExpiresAt));
        });

        _context.ChangeTracker.Clear();
        var user = await _context
            .Users.Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(user, Is.Not.Null);

        var userRefreshToken = user.RefreshTokens.First();
        Assert.Multiple(() =>
        {
            Assert.That(user.Otp, Is.Null);
            Assert.That(user.OtpExpiresAt, Is.Null);
            Assert.That(user.RefreshTokens, Has.Count.EqualTo(1));
            Assert.That(userRefreshToken.TokenHash, Is.EqualTo("hashed_refresh_token"));
            Assert.That(userRefreshToken.TokenExpiresAt, Is.EqualTo(refreshTokenExpiresAt));
            Assert.That(userRefreshToken.UserId, Is.EqualTo(existingUser.Id));
        });
    }

    [Test]
    public async Task CompleteLoginAsync_InvalidOtp_ReturnsBadRequest()
    {
        // Arrange
        var existingUser = CreateUser(
            otp: "123456",
            otpExpiresAt: DateTime.UtcNow.AddMinutes(5),
            passwordHash: "hashed_password"
        );
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new VerifyOtpRequest { Email = "test@test.com", Otp = "654321" };

        // Act
        var result = await _loginService.CompleteLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Invalid or expired verification code"));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        AssertUsersEqual(existingUser, userAfterTest);
    }

    [Test]
    public async Task CompleteLoginAsync_ExpiredOtp_ReturnsBadRequest()
    {
        // Arrange
        var existingUser = CreateUser(
            otp: "123456",
            otpExpiresAt: DateTime.UtcNow.AddMinutes(-1),
            passwordHash: "hashed_password"
        );
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new VerifyOtpRequest { Email = "test@test.com", Otp = "123456" };

        // Act
        var result = await _loginService.CompleteLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Invalid or expired verification code"));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        AssertUsersEqual(existingUser, userAfterTest);
    }

    [Test]
    public async Task CompleteLoginAsync_UserNotFound_ReturnsBadRequest()
    {
        // Arrange
        var request = new VerifyOtpRequest { Email = "nonexistent@test.com", Otp = "123456" };

        // Act
        var result = await _loginService.CompleteLoginAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Invalid or expired verification code"));
        });
    }

    #endregion
}
