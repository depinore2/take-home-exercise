# Take-Home Exercise - Job:Weather Aggregator

## Objective
This exercise is designed to allow the candidate to demonstrate the following things:

1. Can the candidate work at the service-layer, writing code that aggregates data from various data sources using .NET Core?
2. Can the candidate learn quickly, by using a Web Components architecture that's not off-the-shelf like Angular or React?
3. Can the candidate document their work?  We will be expecting a flow chart that describes the flow of data when the user performs a search.

## Application Description
This is a web application for searching for Federal Government jobs based on a keyword and a minimum salary.  The application will then provide the user with all jobs that match that criteria, displaying the average temperature of the job site for the past 5 days.

## Expected Search Functionality
* Given a search phrase, such as `engineer` and a minimum salary of `60000`, the [US Federal Government jobs API](https://search.gov/developer/jobs.html#using-the-api) should be queried and all jobs with a matching keyword & salary should be displayed to the User Interface.
* Only display federal government jobs.
* Display the following fields to the end-user:
  * Position Title
  * Minimum Salary
  * Maximum Salary
  * A list of all locations (city & state), sorted alphabetically in descending order.
  * The average temperature for the 5-day weather forecast, by querying the [Metaweather API](https://www.metaweather.com/api/).  More info below.
* Some jobs have multiple locations.  Please provide an average weather forecast for each location.

Here is an [example request to the jobs API](https://jobs.search.gov/jobs/search.json?query=engineer&tags=federal) that searches for all `engineer` posts.

## Weather Information
In addition to displaying job information, please query the [Metaweather API](https://www.metaweather.com/api/) to fetch 5-day weather forecast.  Take `the_temp` and calculate the average weather across the 5 days.  Display that average on the screen along with the search results as described in the previous section.

Please read the API documentation to understand how to query Metaweather.

## Technical Considerations

* Please make sure to unit test your work. Because there's a light amount of logic, there's an expectation that it will have some degree of code coverage in your test project.
* Please perform your API requests at the .NET Core level, and do as little computational work on the UI layer.
* Don't worry about making the UI look good.  Focus on the functionality.
* The UI is hosted on localhost:8080; the backend is hosted on localhost:3000.
* The UI contains a variable that points to the backend.
* The backend has CORS configuration that allows 8080 to communicate with it.  
  * For more information on CORS in ASP.NET Core, [here are the official docs](https://docs.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-2.2).
  * To check if CORS is working, check the browser console after the app starts.
* It is likely that you will end up getting weather information for the same city multiple times.  Consider caching the results to improve the performance.

## Documentation
* Please provide a flow chart describing the flow of data from the UI to the service layer to the various APIs that you're interfacing with.  Update the backend/README.md file with either an image or URL of your flowchart.
* You are welcome to use whichever diagramming software you want.  If you do not have any preference, we recommend you use https://www.draw.io/.