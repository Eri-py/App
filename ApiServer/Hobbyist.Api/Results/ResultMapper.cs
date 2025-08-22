using Microsoft.AspNetCore.Mvc;

namespace Hobbyist.Api.Results;

/// <summary>
/// Maps application result types to appropriate ASP.NET Core action results.
/// </summary>
/// <remarks>
/// <para>This mapper converts:</para>
/// <list type="bullet">
/// <item><description><see cref="Result"/> -> <see cref="ActionResult"/></description></item>
/// <item><description><see cref="Result{T}"/> -> <see cref="ActionResult{T}"/></description></item>
/// </list>
/// <para>Mapping rules:</para>
/// <list type="bullet">
/// <item><description>Success -> 200 OK (with data for generic results)</description></item>
/// <item><description>NoContent -> 204 No Content</description></item>
/// <item><description>BadRequest -> 400 Bad Request</description></item>
/// <item><description>Unauthorized -> 401 Unauthorized</description></item>
/// <item><description>NotFound -> 404 Not Found</description></item>
/// <item><description>Conflict -> 409 Conflict</description></item>
/// <item><description>InternalServerError -> 500 Internal Server Error</description></item>
/// </list>
/// </remarks>
public static class ResultMapper
{
    /// <summary>
    /// Maps a non-generic result to an action result.
    /// </summary>
    /// <param name="result">The operation result to map</param>
    /// <returns>An appropriate ASP.NET Core action result</returns>
    public static ActionResult Map(Result result)
    {
        return MapInternal(result.ResultType, result.Message, content: null);
    }

    /// <summary>
    /// Maps a generic result to a typed action result.
    /// </summary>
    /// <typeparam name="T">The type of the result data</typeparam>
    /// <param name="result">The operation result to map</param>
    /// <returns>An appropriate typed ASP.NET Core action result</returns>
    public static ActionResult<T> Map<T>(Result<T> result)
    {
        return MapInternal(result.ResultType, result.Message, result.Content);
    }

    /// <summary>
    /// Maps raw result components to a typed action result.
    /// </summary>
    /// <typeparam name="T">The expected response type</typeparam>
    /// <param name="resultType">The result type</param>
    /// <param name="message">The result message (for error cases)</param>
    /// <param name="content">The result content (for success cases)</param>
    /// <returns>An appropriate typed ASP.NET Core action result</returns>
    /// <remarks>
    /// This overload is useful for cases where you need to construct results manually.
    /// </remarks>
    public static ActionResult<T> Map<T>(ResultTypes resultType, string? message, object? content)
    {
        return MapInternal(resultType, message, content);
    }

    /// <summary>
    /// Internal mapping implementation that handles all result types.
    /// </summary>
    /// <param name="resultType">The result type to map</param>
    /// <param name="message">The message to include (for error responses)</param>
    /// <param name="content">The content to include (for success responses)</param>
    /// <returns>The mapped action result</returns>
    private static ActionResult MapInternal(
        ResultTypes resultType,
        string? message,
        object? content
    )
    {
        return resultType switch
        {
            // Successful results
            ResultTypes.Success => new OkObjectResult(content),
            ResultTypes.NoContent => new NoContentResult(),

            // Error results (all return message in consistent { message } format)
            ResultTypes.BadRequest => new BadRequestObjectResult(new { message }),
            ResultTypes.Unauthorized => new UnauthorizedObjectResult(new { message }),
            ResultTypes.NotFound => new NotFoundObjectResult(new { message }),
            ResultTypes.Conflict => new ConflictObjectResult(new { message }),
            ResultTypes.InternalServerError => new ObjectResult(new { message })
            {
                StatusCode = 500,
            },

            // Fallback for unknown result types
            _ => new ObjectResult(new { message = "An unexpected error occurred" })
            {
                StatusCode = 500,
            },
        };
    }
}
