namespace App.Api.Services;

public enum ResultTypes
{
    Success,
    NoContent,
    Created,

    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    Conflict,
    TooManyRequests,
    InternalServerError,
}

public record Result(string? Message, ResultTypes ResultType)
{
    public bool IsSuccess =>
        ResultType is ResultTypes.Success or ResultTypes.NoContent or ResultTypes.Created;

    public static Result Success(string message) => new(message, ResultTypes.Success);

    public static Result NoContent() => new(null, ResultTypes.NoContent);

    public static Result Created(string message) => new(message, ResultTypes.Created);

    public static Result BadRequest(string message) => new(message, ResultTypes.BadRequest);

    public static Result Unauthorized(string message) => new(message, ResultTypes.Unauthorized);

    public static Result Forbidden(string message) => new(message, ResultTypes.Forbidden);

    public static Result NotFound(string message) => new(message, ResultTypes.NotFound);

    public static Result Conflict(string message) => new(message, ResultTypes.Conflict);

    public static Result TooManyRequests(string message) =>
        new(message, ResultTypes.TooManyRequests);

    public static Result InternalServerError(string message) =>
        new(message, ResultTypes.InternalServerError);
}

public record Result<T>(string? Message, ResultTypes ResultType, T? Content = default)
{
    public static Result<T> Success(T content, string message) =>
        new(message, ResultTypes.Success, content);

    public static Result<T> Created(T content, string message) =>
        new(message, ResultTypes.Created, content);

    public static implicit operator Result<T>(Result result) =>
        new(result.Message, result.ResultType);

    public static implicit operator Result(Result<T> result) =>
        new(result.Message, result.ResultType);
}
