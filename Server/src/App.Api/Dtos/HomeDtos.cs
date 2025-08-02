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
