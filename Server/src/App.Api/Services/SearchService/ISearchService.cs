using App.Api.Dtos;
using App.Api.Results;

namespace App.Api.Services.SearchService;

/// <summary>
/// Provides services for handling searching functionality including getting search results, and
/// updating user search history.
/// </summary>
public interface ISearchService
{
    /// <summary>
    /// Compares query value against entries in hobbies and users database to get matching hobbies and usernames.
    /// </summary>
    /// <param name="query">String containing text being searched for.</param>
    /// <returns><see cref="GetSearchResultResponse"/> containing matching results if found, else an empty list.</returns>
    public Task<Result<GetSearchResultResponse>> GetSearchResultAsync(string query);

    /// <summary>
    /// Updates the user's search history after a search action.
    /// </summary>
    /// <param name="query"></param>
    /// <returns></returns>
    public Task<Result> UpdateSearchHistoryAsync(UpdateSearchHistoryRequest request, Guid userId);

    /// <summary>
    ///
    /// </summary>
    /// <param name="request"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<Result<GetSearchHistoryResponse>> GetSearchHistoryAsync(Guid userId);
}
