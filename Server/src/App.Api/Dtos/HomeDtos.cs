using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

/// <summary>
/// Defines the shape of data expected from the web client when searching
/// </summary>
public record class GetSearchResultRequest
{
    /// <summary>Content being searched for</summary>
    [Required]
    public required string Query { get; set; }
}

/// <summary>
/// Defines the shape of a single search result returned to the web client after running search query through data.
/// </summary>
public record class GetSearchResultDto
{
    /// <summary>Name of user or hobby containing the search query</summary>
    public required string Name { get; set; }

    /// <summary>If the result found is a user or a hobby</summary>
    public required string Category { get; set; }
}

/// <summary>
/// Defines the shape of the response containing search results returned to the web client.
/// </summary>
public record class GetSearchResultResponse
{
    /// <summary>List of search results matching the query</summary>
    public required List<GetSearchResultDto> Result { get; set; }
}

/// <summary>
/// Defines the shape of data expected from the web client when updating search history.
/// </summary>
public record class SearchHistoryRequest
{
    /// <summary>List of search terms to add to user's search history</summary>
    [Required]
    public required List<string> SearchTerms { get; set; }
}
