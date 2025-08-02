using System;
using App.Api.Dtos;
using App.Api.Results;

namespace App.Api.Services.SearchService;

/// <summary>
/// Provides services for handling searching functionality including getting search result, and
/// updating user search history.
/// </summary>
public interface ISearchService
{
    /// <summary>
    /// Compares query value against entries in hobbies and users database to get matching hobbies and usernames.
    /// </summary>
    /// <param name="query">String containing text being searched for.</param>
    /// <returns>List containing <see cref="GetSearchResultDto"/> if matches are found else, an empty list.</returns>
    public Task<Result<List<GetSearchResultDto>>> GetSearchResultAsync(string query);
}
