using Microsoft.AspNetCore.Mvc;

namespace App.Api.Results;

public static class ResultMapper
{
    public static ActionResult Map(Result result)
    {
        return MapInternal(result.ResultType, result.Message, content: null);
    }

    public static ActionResult<T> Map<T>(Result<T> result)
    {
        return MapInternal(result.ResultType, result.Message, result.Content);
    }

    public static ActionResult<T> Map<T>(ResultTypes resultType, string? message, object? content)
    {
        return MapInternal(resultType, message, content);
    }

    private static ActionResult MapInternal(
        ResultTypes resultType,
        string? message,
        object? content
    )
    {
        return resultType switch
        {
            ResultTypes.Success => new OkObjectResult(content),
            ResultTypes.NoContent => new NoContentResult(),

            ResultTypes.BadRequest => new BadRequestObjectResult(new { message }),
            ResultTypes.Unauthorized => new UnauthorizedObjectResult(new { message }),
            ResultTypes.NotFound => new NotFoundObjectResult(new { message }),
            ResultTypes.Conflict => new ConflictObjectResult(new { message }),
            ResultTypes.InternalServerError => new ObjectResult(new { message })
            {
                StatusCode = 500,
            },

            _ => new ObjectResult(new { message = "An unexpected error occurred" })
            {
                StatusCode = 500,
            },
        };
    }
}
