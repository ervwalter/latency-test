using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Latency.Controllers
{
    [ApiController]
    [Route("/api/work")]

    public class WorkController : ControllerBase
    {
        [HttpGet]
        public async Task<byte[]> Get(int delay = 1000, int size = 256)
        {
            var stopwatch = Stopwatch.StartNew();
            var randomData = new byte[(int)(size * 0.75)];
            var rnd = new Random();
            rnd.NextBytes(randomData);
            while (stopwatch.Elapsed.TotalMilliseconds < delay)
            {
                await Task.Delay(10);
            }
            return randomData;
        }
    }
}