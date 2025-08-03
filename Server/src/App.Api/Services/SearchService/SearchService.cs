using App.Api.Data;
using App.Api.Dtos;
using App.Api.Results;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.SearchService;

public class SearchService(AppDbContext context) : ISearchService
{
    public async Task<Result<GetSearchResultResponse>> GetSearchResultAsync(string query)
    {
        // Check if query is empty.
        if (string.IsNullOrWhiteSpace(query))
            return Result<GetSearchResultResponse>.Success(
                new GetSearchResultResponse { Result = [] }
            );

        query = query.Trim();
        List<GetSearchResultDto> results = [];

        // get all hobbies matching the query.
        var hobbies = await context
            .Hobbies.Where(h => h.CategoryName.Contains(query))
            .Select(h => new GetSearchResultDto { Name = h.CategoryName, Category = "hobbies" })
            .ToListAsync();

        // get all users matching the query.
        var users = await context
            .Users.Where(u => u.Username.Contains(query))
            .Select(u => new GetSearchResultDto { Name = u.Username, Category = "users" })
            .ToListAsync();

        results.AddRange(hobbies);
        results.AddRange(users);

        return Result<GetSearchResultResponse>.Success(
            new GetSearchResultResponse { Result = results }
        );
    }
}
