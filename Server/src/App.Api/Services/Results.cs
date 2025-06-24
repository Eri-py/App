namespace App.Api.Services;

public record class Results<T>(bool IsSuccess, T? Data = default, string? ErrorMessage = null)
{
    public static Results<T> Success(T data) => new(IsSuccess: true, Data: data);

    public static Results<T> Failure(string errorMessage) =>
        new(IsSuccess: false, ErrorMessage: errorMessage);
}

public record class Results(bool IsSuccess, string? ErrorMessage = null)
{
    public static Results Success() => new(IsSuccess: true);

    public static Results Failure(string errorMessage) =>
        new(IsSuccess: false, ErrorMessage: errorMessage);
}
