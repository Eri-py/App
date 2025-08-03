using System.Threading.Tasks;
using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.SearchService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController(ISearchService searchService) : ControllerBase
    {
        [HttpPost("search-results")]
        public async Task<ActionResult<GetSearchResultResponse>> GetSearchResult(
            [FromBody] GetSearchResultRequest request
        )
        {
            var query = request.Query.ToLower();
            var result = await searchService.GetSearchResultAsync(query);

            return ResultMapper.Map(result);
        }

        [HttpGet("get-search-history")]
        [Authorize]
        public async Task<ActionResult<GetSearchHistoryResponse>> GetSearchHistory()
        {
            var userId = Guid.Parse(ApiHelper.GetUserDetails(User).Id);
            var result = await searchService.GetSearchHistoryAsync(userId);

            return ResultMapper.Map(result);
        }

        [HttpPost("update-search-history")]
        [Authorize]
        public async Task<IActionResult> UpdateSearchHistory(
            [FromBody] UpdateSearchHistoryRequest request
        )
        {
            var userId = Guid.Parse(ApiHelper.GetUserDetails(User).Id);
            var result = await searchService.UpdateSearchHistoryAsync(request, userId);

            return ResultMapper.Map(result);
        }
    }
}
