using App.Api.Data;
using App.Api.Data.Entities;
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

    public async Task<Result> UpdateSearchHistoryAsync(
        UpdateSearchHistoryRequest request,
        Guid userId
    )
    {
        // Get all existing searches for user
        var existingSearches = await context.Searches.Where(s => s.UserId == userId).ToListAsync();

        // Check if there's content to delete or update
        if (existingSearches.Count != 0)
        {
            // Delete searches not in request
            var toDelete = existingSearches.Where(s => !request.SearchTerms.Contains(s.SearchTerm));
            context.Searches.RemoveRange(toDelete);

            // Update existing searches that are in request
            var toUpdate = existingSearches.Where(s => request.SearchTerms.Contains(s.SearchTerm));
            foreach (var entry in toUpdate)
            {
                entry.SearchAmount++;
                entry.SearchedAt = DateTime.UtcNow;
            }
        }

        // Add new search terms
        var existingTerms = existingSearches.Select(s => s.SearchTerm).ToList();
        var toAdd = request
            .SearchTerms.Where(term => !existingTerms.Contains(term))
            .Select(term => new SearchEntity
            {
                UserId = userId,
                SearchTerm = term,
                SearchAmount = 1,
                SearchedAt = DateTime.UtcNow,
            });
        ;

        await context.Searches.AddRangeAsync(toAdd);
        await context.SaveChangesAsync();

        return Result.NoContent();
    }
}
