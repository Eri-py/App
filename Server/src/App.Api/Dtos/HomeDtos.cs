using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class GetSearchResultRequest
{
    [Required]
    public required string Query { get; set; }
}
