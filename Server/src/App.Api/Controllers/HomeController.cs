using App.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController(AppDbContext context) : ControllerBase
    {
        [HttpGet("search-history")]
        [Authorize]
        public IActionResult GetSearchHistory()
        {
            var userId = ApiHelper.GetUserDetails(User).Id;
            var user = context.Users.FirstOrDefault(u => u.Id == Guid.Parse(userId));

            return Ok(
                $"Adding search history route.\n{user!.Firstname}\n{user.Lastname}\n{user.Email}"
            );
        }

        [HttpPost("search-results")]
        public IActionResult GetSearchResult()
        {
            return Ok("Adding search route");
        }
    }
}
