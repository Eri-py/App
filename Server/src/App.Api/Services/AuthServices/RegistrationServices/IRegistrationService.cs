using App.Api.Dtos;
using App.Api.Results;

/// <summary>
/// Initiates the registration process by validating and storing initial user information.
/// </summary>
/// <param name="request">The registration request containing username and email. See <see cref="StartRegistrationRequest"/></param>
/// <returns>Result<string></returns>
/// <remarks>
/// This first step validates the username/email availability and sends an OTP to the provided email.
/// </remarks>
namespace App.Api.Services.AuthServices.RegistrationServices;

/// <summary>
/// Provides services for handling user registration processes including
/// initial signup, OTP verification, and registration completion.
/// </summary>
public interface IRegistrationService
{
    /// <summary>
    /// Initiates the registration process by validating and storing initial user information.
    /// </summary>
    /// <param name="request">The registration request containing username and email. See <see cref="StartRegistrationRequest"/></param>
    /// <returns><see cref="Result{T}"/> where T is <see cref="string"/></returns>
    public Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request);

    /// <summary>
    /// Verifies the One-Time Passcode (OTP) sent to the user's email during registration.
    /// </summary>
    /// <param name="request">The verification request containing email and OTP. See <see cref="VerifyOtpRequest"/></param>
    /// <returns>Result</returns>
    /// <remarks>
    /// Successful verification marks the email as confirmed in the system.
    /// </remarks>
    public Task<Result> VerifyOtpAsync(VerifyOtpRequest request);

    /// <summary>
    /// Completes the registration process by saving all user details and creating an account.
    /// </summary>
    /// <param name="request">The complete registration request containing all user details. See <see cref="CompleteRegistrationRequest"/></param>
    /// <returns><see cref="Result{T}"/> where T is <see cref="AuthResult"/></returns>
    /// <remarks>
    /// This final step requires all user information and creates the actual user account.
    /// </remarks>
    public Task<Result<AuthResult>> CompleteRegistrationAsync(CompleteRegistrationRequest request);
}
