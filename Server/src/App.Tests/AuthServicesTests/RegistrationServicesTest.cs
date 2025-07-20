using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Services.AuthServices.RegistrationServices;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using App.Api.Services.Helpers;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace App.Tests.AuthServicesTests;

[TestFixture]
public class RegistrationServicesTest
{
    private Mock<IEmailService> _emailService;
    private Mock<IJwtService> _jwtService;
    private AppDbContext _context;
    private RegistrationService _registrationService;

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

        _registrationService = new RegistrationService(
            _context,
            _emailService.Object,
            _jwtService.Object
        );
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

    #region StartRegistrationAsync Tests

    [Test]
    public async Task StartRegistrationAsync_NewUser_Success()
    {
        // Arrange
        var request = new StartRegistrationRequest
        {
            Username = "TestUser",
            Email = "test@gmail.com",
        };
        var username = request.Username.ToLower();
        var email = request.Email.ToLower();

        var otp = "123456";
        var expiresAt = DateTime.UtcNow.AddMinutes(5);

        _jwtService.Setup(x => x.CreateOtp(5)).Returns((otp, expiresAt));
        _emailService
            .Setup(x => x.SendEmailVerificationAsync(email, username, otp, "5 minutes"))
            .ReturnsAsync(Result.NoContent());

        // Act
        var result = await _registrationService.StartRegistrationAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(result.Content, Is.EqualTo(expiresAt.ToString("o")));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        Assert.That(userAfterTest, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(userAfterTest.Username, Is.EqualTo(username));
            Assert.That(userAfterTest.Email, Is.EqualTo(email));
            Assert.That(userAfterTest.Otp, Is.EqualTo(otp));
            Assert.That(userAfterTest.OtpExpiresAt, Is.EqualTo(expiresAt));
            Assert.That(userAfterTest.PasswordHash, Is.Null);
            Assert.That(userAfterTest.Firstname, Is.Null);
            Assert.That(userAfterTest.Lastname, Is.Null);
            Assert.That(userAfterTest.DateOfBirth, Is.Null);
            Assert.That(userAfterTest.CreatedAt, Is.Null);
            Assert.That(userAfterTest.RefreshTokens, Is.Empty);
        });
    }

    [Test]
    public async Task StartRegistrationAsync_ExistingIncompleteUser_UpdatesDetails()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "olduser",
            Email = "old@test.com",
            Otp = "123456",
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(3),
            PasswordHash = null,
            Firstname = null,
            Lastname = null,
            DateOfBirth = null,
            CreatedAt = null,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new StartRegistrationRequest { Username = "NewUser", Email = "old@test.com" };
        var username = request.Username.ToLower();
        var email = request.Email.ToLower();

        var newOtp = "654321";
        var newExpiresAt = DateTime.UtcNow.AddMinutes(5);

        _jwtService.Setup(x => x.CreateOtp(5)).Returns((newOtp, newExpiresAt));
        _emailService
            .Setup(x => x.SendEmailVerificationAsync(email, username, newOtp, "5 minutes"))
            .ReturnsAsync(Result.NoContent());

        // Act
        var result = await _registrationService.StartRegistrationAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.True);
            Assert.That(result.Content, Is.EqualTo(newExpiresAt.ToString("o")));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(userAfterTest.Id, Is.EqualTo(existingUser.Id));
            Assert.That(userAfterTest.Username, Is.EqualTo(username));
            Assert.That(userAfterTest.Email, Is.EqualTo(email));
            Assert.That(userAfterTest.Otp, Is.EqualTo(newOtp));
            Assert.That(userAfterTest.OtpExpiresAt, Is.EqualTo(newExpiresAt));
            Assert.That(userAfterTest.PasswordHash, Is.Null);
            Assert.That(userAfterTest.Firstname, Is.Null);
            Assert.That(userAfterTest.Lastname, Is.Null);
            Assert.That(userAfterTest.DateOfBirth, Is.Null);
            Assert.That(userAfterTest.CreatedAt, Is.Null);
            Assert.That(userAfterTest.RefreshTokens, Is.Empty);
        });
    }

    [Test]
    public async Task StartRegistrationAsync_UsernameTaken_ReturnsConflict()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "takenuser",
            Email = "taken@test.com",
            Otp = null,
            OtpExpiresAt = null,
            PasswordHash = "hashed_password",
            Firstname = "John",
            Lastname = "Doe",
            DateOfBirth = new DateOnly(1990, 1, 1),
            CreatedAt = DateTime.UtcNow,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new StartRegistrationRequest
        {
            Username = "TakenUser",
            Email = "new@test.com",
        };

        // Act
        var result = await _registrationService.StartRegistrationAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Username taken"));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        AssertUsersEqual(existingUser, userAfterTest);
    }

    [Test]
    public async Task StartRegistrationAsync_EmailTaken_ReturnsConflict()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "user1",
            Email = "taken@test.com",
            Otp = null,
            OtpExpiresAt = null,
            PasswordHash = "hashed_password",
            Firstname = "Jane",
            Lastname = "Smith",
            DateOfBirth = new DateOnly(1985, 5, 15),
            CreatedAt = DateTime.UtcNow,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new StartRegistrationRequest
        {
            Username = "newuser",
            Email = "Taken@test.com",
        };

        // Act
        var result = await _registrationService.StartRegistrationAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Email taken"));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        AssertUsersEqual(existingUser, userAfterTest);
    }

    [Test]
    public async Task StartRegistrationAsync_EmailSendingFails_RollsBack()
    {
        // Arrange
        var request = new StartRegistrationRequest
        {
            Username = "TestUser",
            Email = "test@gmail.com",
        };
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
        var result = await _registrationService.StartRegistrationAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Error sending email"));
        });

        _context.ChangeTracker.Clear();
        var userCount = await _context.Users.CountAsync();
        Assert.That(userCount, Is.EqualTo(0));
    }

    #endregion

    #region VerifyOtpAsync Tests

    [Test]
    public async Task VerifyOtpAsync_ValidOtp_ReturnsSuccessAndClearsOtp()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@test.com",
            Otp = "123456",
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(5),
            PasswordHash = null,
            Firstname = null,
            Lastname = null,
            DateOfBirth = null,
            CreatedAt = null,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new VerifyOtpRequest { Email = "test@test.com", Otp = "123456" };

        // Act
        var result = await _registrationService.VerifyOtpAsync(request);

        // Assert
        Assert.That(result.IsSuccess, Is.True);

        _context.ChangeTracker.Clear();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(user, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(user.Id, Is.EqualTo(existingUser.Id));
            Assert.That(user.Username, Is.EqualTo(existingUser.Username));
            Assert.That(user.Email, Is.EqualTo(existingUser.Email));
            Assert.That(user.Otp, Is.Null);
            Assert.That(user.OtpExpiresAt, Is.Null);
            Assert.That(user.PasswordHash, Is.Null);
            Assert.That(user.Firstname, Is.Null);
            Assert.That(user.Lastname, Is.Null);
            Assert.That(user.DateOfBirth, Is.Null);
            Assert.That(user.CreatedAt, Is.Null);
            Assert.That(user.RefreshTokens, Is.Empty);
        });
    }

    [Test]
    public async Task VerifyOtpAsync_InvalidOtp_ReturnsBadRequest()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@test.com",
            Otp = "123456",
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(5),
            PasswordHash = null,
            Firstname = null,
            Lastname = null,
            DateOfBirth = null,
            CreatedAt = null,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new VerifyOtpRequest { Email = "test@test.com", Otp = "654321" };

        // Act
        var result = await _registrationService.VerifyOtpAsync(request);

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
    public async Task VerifyOtpAsync_ExpiredOtp_ReturnsBadRequest()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@test.com",
            Otp = "123456",
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(-1),
            PasswordHash = null,
            Firstname = null,
            Lastname = null,
            DateOfBirth = null,
            CreatedAt = null,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new VerifyOtpRequest { Email = "test@test.com", Otp = "123456" };

        // Act
        var result = await _registrationService.VerifyOtpAsync(request);

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

    #endregion

    #region CompleteRegistrationAsync Tests

    [Test]
    public async Task CompleteRegistrationAsync_ValidUser_ReturnsTokensAndCompletesRegistration()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@test.com",
            Otp = null,
            OtpExpiresAt = null,
            PasswordHash = null,
            Firstname = null,
            Lastname = null,
            DateOfBirth = null,
            CreatedAt = null,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new CompleteRegistrationRequest
        {
            Email = "test@test.com",
            Username = "testuser",
            Password = "Test@123",
            Firstname = "Test",
            Lastname = "User",
            DateOfBirth = "1990-01-01",
        };

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
        var result = await _registrationService.CompleteRegistrationAsync(request);

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
            Assert.That(user.Id, Is.EqualTo(existingUser.Id));
            Assert.That(user.Username, Is.EqualTo(existingUser.Username));
            Assert.That(user.Email, Is.EqualTo(existingUser.Email));
            Assert.That(user.Otp, Is.Null);
            Assert.That(user.OtpExpiresAt, Is.Null);
            Assert.That(user.PasswordHash, Is.Not.Null);
            Assert.That(user.Firstname, Is.EqualTo(request.Firstname));
            Assert.That(user.Lastname, Is.EqualTo(request.Lastname));
            Assert.That(user.DateOfBirth, Is.EqualTo(DateOnly.Parse(request.DateOfBirth)));
            Assert.That(
                user.CreatedAt,
                Is.EqualTo(DateTime.UtcNow).Within(TimeSpan.FromSeconds(5))
            );
            Assert.That(user.RefreshTokens, Has.Count.EqualTo(1));
            Assert.That(userRefreshToken.TokenHash, Is.EqualTo("hashed_refresh_token"));
            Assert.That(userRefreshToken.TokenExpiresAt, Is.EqualTo(refreshTokenExpiresAt));
            Assert.That(userRefreshToken.UserId, Is.EqualTo(existingUser.Id));
        });
    }

    [Test]
    public async Task CompleteRegistrationAsync_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        var request = new CompleteRegistrationRequest
        {
            Email = "nonexistent@test.com",
            Username = "nonexistent",
            Password = "Test@123",
            Firstname = "Test",
            Lastname = "User",
            DateOfBirth = "1990-01-01",
        };

        // Act
        var result = await _registrationService.CompleteRegistrationAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("User not found"));
        });

        _context.ChangeTracker.Clear();
        var userCount = await _context.Users.CountAsync();
        Assert.That(userCount, Is.EqualTo(0));
    }

    #endregion

    #region ResendVerificationCodeAsync Tests

    [Test]
    public async Task ResendVerificationCodeAsync_ValidUser_ResendsCode()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@test.com",
            Otp = "oldotp",
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(-1),
            PasswordHash = null,
            Firstname = null,
            Lastname = null,
            DateOfBirth = null,
            CreatedAt = null,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new ResendVerificationCodeRequest { Identifier = "test@test.com" };

        var newOtp = "654321";
        var expiresAt = DateTime.UtcNow.AddMinutes(5);

        _jwtService.Setup(x => x.CreateOtp(5)).Returns((newOtp, expiresAt));
        _emailService
            .Setup(x =>
                x.SendEmailVerificationAsync(
                    existingUser.Email,
                    existingUser.Username,
                    newOtp,
                    "5 minutes"
                )
            )
            .ReturnsAsync(Result.NoContent());

        // Act
        var result = await _registrationService.ResendVerificationCodeAsync(request);

        // Assert
        Assert.That(result.IsSuccess, Is.True);

        _context.ChangeTracker.Clear();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(user, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(user.Id, Is.EqualTo(existingUser.Id));
            Assert.That(user.Username, Is.EqualTo(existingUser.Username));
            Assert.That(user.Email, Is.EqualTo(existingUser.Email));
            Assert.That(user.Otp, Is.EqualTo(newOtp));
            Assert.That(user.OtpExpiresAt, Is.EqualTo(expiresAt));
            Assert.That(user.PasswordHash, Is.Null);
            Assert.That(user.Firstname, Is.Null);
            Assert.That(user.Lastname, Is.Null);
            Assert.That(user.DateOfBirth, Is.Null);
            Assert.That(user.CreatedAt, Is.Null);
            Assert.That(user.RefreshTokens, Is.Empty);
        });
    }

    [Test]
    public async Task ResendVerificationCodeAsync_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        var request = new ResendVerificationCodeRequest { Identifier = "nonexistent@test.com" };

        // Act
        var result = await _registrationService.ResendVerificationCodeAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("User not found"));
        });

        _context.ChangeTracker.Clear();
        var userCount = await _context.Users.CountAsync();
        Assert.That(userCount, Is.EqualTo(0));
    }

    [Test]
    public async Task ResendVerificationCodeAsync_EmailSendingFails_RollsBack()
    {
        // Arrange
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@test.com",
            Otp = "123456",
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(-1),
            PasswordHash = null,
            Firstname = null,
            Lastname = null,
            DateOfBirth = null,
            CreatedAt = null,
            RefreshTokens = [],
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var request = new ResendVerificationCodeRequest { Identifier = "test@test.com" };

        var newOtp = "654321";
        var newExpiresAt = DateTime.UtcNow.AddMinutes(5);

        _jwtService.Setup(x => x.CreateOtp(5)).Returns((newOtp, newExpiresAt));
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
        var result = await _registrationService.ResendVerificationCodeAsync(request);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.IsSuccess, Is.False);
            Assert.That(result.Message, Is.EqualTo("Error sending email"));
        });

        _context.ChangeTracker.Clear();
        var userAfterTest = await _context.Users.FirstOrDefaultAsync(u => u.Id == existingUser.Id);
        Assert.That(userAfterTest, Is.Not.Null);
        AssertUsersEqual(existingUser, userAfterTest);
    }

    #endregion
}
