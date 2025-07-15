using System;
using App.Api.Services;
using App.Api.Services.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers.Helpers;

public static class ResultMapper
{
    public static ActionResult Map(Result result)
    {
        return result.ResultType switch
        {
            ResultTypes.Success => new OkObjectResult(result.Message),
            ResultTypes.NoContent => new NoContentResult(),
            ResultTypes.Created => new CreatedResult(string.Empty, result.Message),

            ResultTypes.BadRequest => new BadRequestObjectResult(new { message = result.Message }),
            ResultTypes.Unauthorized => new UnauthorizedObjectResult(
                new { message = result.Message }
            ),
            ResultTypes.Forbidden => new ObjectResult(new { message = result.Message })
            {
                StatusCode = 403,
            },
            ResultTypes.NotFound => new NotFoundObjectResult(new { message = result.Message }),
            ResultTypes.Conflict => new ConflictObjectResult(new { message = result.Message }),
            ResultTypes.TooManyRequests => new ObjectResult(new { message = result.Message })
            {
                StatusCode = 429,
            },
            ResultTypes.InternalServerError => new ObjectResult(new { message = result.Message })
            {
                StatusCode = 500,
            },

            _ => new ObjectResult(new { message = "An unexpected error occurred" })
            {
                StatusCode = 500,
            },
        };
    }

    public static ActionResult<T> Map<T>(Result<T> result)
    {
        return result.ResultType switch
        {
            ResultTypes.Success => new OkObjectResult(result.Content),
            ResultTypes.NoContent => new NoContentResult(),
            ResultTypes.Created => new CreatedResult(string.Empty, result.Content),

            ResultTypes.BadRequest => new BadRequestObjectResult(new { message = result.Message }),
            ResultTypes.Unauthorized => new UnauthorizedObjectResult(
                new { message = result.Message }
            ),
            ResultTypes.Forbidden => new ObjectResult(new { message = result.Message })
            {
                StatusCode = 403,
            },
            ResultTypes.NotFound => new NotFoundObjectResult(new { message = result.Message }),
            ResultTypes.Conflict => new ConflictObjectResult(new { message = result.Message }),
            ResultTypes.TooManyRequests => new ObjectResult(new { message = result.Message })
            {
                StatusCode = 429,
            },
            ResultTypes.InternalServerError => new ObjectResult(new { message = result.Message })
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
