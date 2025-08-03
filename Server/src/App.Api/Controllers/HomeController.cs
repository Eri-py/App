using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.SearchService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController(ISearchService searchService) : ControllerBase
    {
        [HttpPost("search-suggestions")]
        public async Task<ActionResult<GetSearchSuggestionsResponse>> GetSearchSuggestions(
            [FromBody] GetSearchSuggestionsRequest request
        )
        {
            var query = request.Query.ToLower();
            var result = await searchService.GetSearchSuggestionsAsync(query);

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

        [HttpPost("add-search-term")]
        [Authorize]
        public async Task<IActionResult> AddOrUpdateSearchTerm(
            [FromBody] AddOrUpdateSearchTermRequest request
        )
        {
            var userId = Guid.Parse(ApiHelper.GetUserDetails(User).Id);
            var result = await searchService.AddOrUpdateSearchTermAsync(request, userId);

            return ResultMapper.Map(result);
        }

        [HttpPost("remove-search-terms")]
        [Authorize]
        public async Task<IActionResult> RemoveSearchTerms(
            [FromBody] RemoveSearchTermsRequest request
        )
        {
            var userId = Guid.Parse(ApiHelper.GetUserDetails(User).Id);
            var result = await searchService.RemoveSearchTermsAsync(request, userId);

            return ResultMapper.Map(result);
        }
    }
}
