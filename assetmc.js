<script runat = "server">
    Platform.load ("Core", "1");

try {
    // authenticate to SFMC get access token
    var contentType = 'application/json';
    var authEndpoint = 'https://xxxxxxxxxx.auth.marketingcloudapis.com/v2/token' //provide API endpoint
    var payload = {
        client_id: "xxxxxxxxxxxxx",
        client_secret: "xxxxxxxxxxxxx",
        account_id: "xxxxxx7",
        grant_type: "client_credentials"
    };
    
    var accessTokenRequest = HTTP.Post(authEndpoint, contentType, Stringify(payload));
    var resultCode = (accessTokenRequest.StatusCode);
    if (resultCode == 200) {
          var tokenResponse = Platform.Function.ParseJSON(accessTokenRequest.Response[0]);
          var accessToken = tokenResponse.access_token; //get access token from response
          var rest_instance_url = tokenResponse.rest_instance_url; //get rest url for any request that we are going to make
     }

    //make api call via request
    if (access_token != null) {
        var assetURL = rest_instance_url + "/asset/v1/content/assets?$page=1"; //initial url
        var headerNames = ["Authorization"];
        var headerValues = ["Bearer" + accessToken];
        var assetResponse = Platform.Function.ParseJSON(String(assetResponse.Content));
        var assetAccount = finalResponse.count;
        var pageCount = finalResponse.page;
        var pageSize = finalResponse.pageSize;
        var iteraterows = Math.ceil(assetCount / pageSize) + 1; //Formula to get how many times we need to call the content API
        for (var j = 1; j < iteraterows; j++) {
            var assetURLFinal = rest_instance_url + "/asset/v1/content/assets?$page=" +j; //Iterating the pages dynamically
            var headerNames = ["Authorization"];
            var headerValues = ["Bearer " + accessToken];
            var assetresponseFinal = HTTP.Get(assetURLFinal, headerNames, headerValues);
            var finalResponseFinal = Platform.Function.ParseJSON(String(assetresponseFinal.Content));
            for (var i = 0; i < finalResponseFinal.items.length; i++) {
                var displayName = finalResponseFinal.items[i].assetType.displayName;
                if (displayName == "Image") { //checking if the type is Image
                    var assetId = finalResponseFinal.items[i].id;
                    var publishedURL = finalResponseFinal.items[i].fileProperties.publishedURL;
                    var fileName = finalResponseFinal.items[i].fileProperties.fileName;
                    var rows = Platform.Function.UpsertDE("DE_Asset_ID", ["Asset_Id"],[id] ,["Asset_URL"], [publishedURL], ["Asset_Name"], [fileName]); //upserting the Image URL Link, ID and file name
                }
            }
        }

    }
    
} catch (error) {
    Write(Stringify(error));
}
</script>
