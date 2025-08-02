using System;
using System.Security.Claims;
using App.Api.Dtos;

namespace App.Api.Controllers;

public class ApiHelper
{
    public static UserDto GetUserDetails(ClaimsPrincipal user)
    {
        return new UserDto
        {
            Id = user.FindFirst(ClaimTypes.NameIdentifier)!.Value,
            Username = user.Identity!.Name!,
            Email = user.FindFirst(ClaimTypes.Email)!.Value,
            Firstname = user.FindFirst(ClaimTypes.GivenName)!.Value,
            Lastname = user.FindFirst(ClaimTypes.Surname)!.Value,
        };
    }
}
