using System;
using App.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers;

public static class ResultMapper
{
    public static ActionResult Map(Result result)
    {
        return result.ResultType switch
        {
            ResultTypes.Success => new OkObjectResult(result.Message),
            ResultTypes.NoContent => new NoContentResult(),
            ResultTypes.Created => new CreatedResult(string.Empty, result.Message),

            ResultTypes.BadRequest => new BadRequestObjectResult(result.Message),
            ResultTypes.Unauthorized => new UnauthorizedObjectResult(result.Message),
            ResultTypes.Forbidden => new ObjectResult(result.Message) { StatusCode = 403 },
            ResultTypes.NotFound => new NotFoundObjectResult(result.Message),
            ResultTypes.Conflict => new ConflictObjectResult(result.Message),
            ResultTypes.TooManyRequests => new ObjectResult(result.Message) { StatusCode = 429 },
            ResultTypes.InternalServerError => new ObjectResult(result.Message)
            {
                StatusCode = 500,
            },

            _ => new ObjectResult("An unexpected error occurred") { StatusCode = 500 },
        };
    }

    public static ActionResult<T> Map<T>(Result<T> result)
    {
        return result.ResultType switch
        {
            ResultTypes.Success => new OkObjectResult(result.Content),
            ResultTypes.NoContent => new NoContentResult(),
            ResultTypes.Created => new CreatedResult(string.Empty, result.Content),

            ResultTypes.BadRequest => new BadRequestObjectResult(result.Message),
            ResultTypes.Unauthorized => new UnauthorizedObjectResult(result.Message),
            ResultTypes.Forbidden => new ObjectResult(result.Message) { StatusCode = 403 },
            ResultTypes.NotFound => new NotFoundObjectResult(result.Message),
            ResultTypes.Conflict => new ConflictObjectResult(result.Message),
            ResultTypes.TooManyRequests => new ObjectResult(result.Message) { StatusCode = 429 },
            ResultTypes.InternalServerError => new ObjectResult(result.Message)
            {
                StatusCode = 500,
            },

            _ => new ObjectResult("An unexpected error occurred") { StatusCode = 500 },
        };
    }
}
