namespace App.Api.Services.Helpers;

public enum ResultTypes
{
    Success,
    NoContent,

    BadRequest,
    Unauthorized,
    NotFound,
    Conflict,
    InternalServerError,
}

public record Result(string? Message, ResultTypes ResultType)
{
    public bool IsSuccess => ResultType is ResultTypes.NoContent;

    public static Result NoContent() => new(null, ResultTypes.NoContent);

    public static Result BadRequest(string message) => new(message, ResultTypes.BadRequest);

    public static Result Unauthorized(string message) => new(message, ResultTypes.Unauthorized);

    public static Result NotFound(string message) => new(message, ResultTypes.NotFound);

    public static Result Conflict(string message) => new(message, ResultTypes.Conflict);

    public static Result InternalServerError(string message) =>
        new(message, ResultTypes.InternalServerError);
}

public record Result<T>(string? Message, ResultTypes ResultType, T? Content = default)
{
    public bool IsSuccess => ResultType is ResultTypes.Success;

    public static Result<T> Success(T content) => new(null, ResultTypes.Success, content);

    // Map all the non-generic negative result types to generic type
    public static implicit operator Result<T>(Result result)
    {
        // Cannot return NoContent with generic type.
        if (result.ResultType == ResultTypes.NoContent)
            throw new InvalidOperationException(
                "Cannot convert NoContent to Result<T>; use non-generic Result instead."
            );

        return new Result<T>(result.Message, result.ResultType, default);
    }
}
