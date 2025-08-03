using System.ComponentModel.DataAnnotations.Schema;

namespace App.Api.Data.Entities;

public class SearchEntity
{
    public Guid Id { get; set; }
    public required string SearchTerm { get; set; }
    public required int SearchAmount { get; set; }
    public required DateTime SearchedAt { get; set; }

    [ForeignKey("User")]
    public required Guid UserId { get; set; }

    //Navigation Property
    public UserEntity? User { get; set; }
}
