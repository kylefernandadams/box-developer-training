package com.box.developer.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.box.sdk.*;
import org.apache.commons.io.FilenameUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.FileReader;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GenerateThumbnail implements RequestHandler<Map<String, Object>, String> {
    private LambdaLogger logger;
    private static final int MAX_CACHE_ENTRIES = 100;

    private static final String AZURE_URI = System.getenv("AZURE_URI");
    private static final String AZURE_SUBSCRIPTION_KEY = System.getenv("AZURE_SUBSCRIPTION_KEY");

    public String handleRequest(Map<String, Object> input, Context context) {

        logger = context.getLogger();
        logger.log("Starting box lambda function...");

        String lambdaResponse = null;
        try{
            // Get the body the web app integration request
            Object requestBody = input.get("body");
            logger.log("Parsing object: " + String.valueOf(requestBody));

            String[] bodyParams = String.valueOf(requestBody).split("&");
            String fileId = bodyParams[0].split("=")[1];
            String fileName = bodyParams[1].split("=")[1];
            BoxDeveloperEditionAPIConnection api = this.getBoxConnection();

            String width = "150";
            String height = "150";
            String smartCropping = "true";
            HttpResponse response = this.sendAzureComputerVisionRequest(api, fileId, width, height, smartCropping);
            HttpEntity entity = response.getEntity();

            // Check for success codes
            if (response.getStatusLine().getStatusCode() == 200) {
                BoxFile.Info boxFileInfo = this.uploadFile(api, fileId, fileName, entity.getContent());

                lambdaResponse = "Successfully Successfully generated thumbnail with new file id: " + boxFileInfo.getID();

            } else {
                lambdaResponse = "Failed to generate thumbnail!";
            }
        }
        catch (Exception e){
            e.printStackTrace();
            logger.log("Failed to generate thumbnails: " + e.getMessage());
        }

        return lambdaResponse;
    }

    private HttpResponse sendAzureComputerVisionRequest(BoxDeveloperEditionAPIConnection api, String fileId, String width, String height, String smartCropping) {
        HttpResponse response = null;
        try {
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            URIBuilder uriBuilder = new URIBuilder(AZURE_URI);
            uriBuilder.setParameter("width", width);
            uriBuilder.setParameter("height", height);
            uriBuilder.setParameter("smartCropping", smartCropping);

            // Prepare the URI for the REST API method and set headers
            URI uri = uriBuilder.build();
            HttpPost request = new HttpPost(uri);
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", AZURE_SUBSCRIPTION_KEY);

            // Request body
            String accessToken = this.getDownscopedToken(api, fileId);
            String fileUrl = "https://api.box.com/2.0/files/" + fileId + "/content?access_token=" + accessToken;
            StringEntity requestEntity = new StringEntity("{\"url\":\"" + fileUrl + "\"}");
            request.setEntity(requestEntity);

            // Call the REST API method and get the response entity.
            response = httpClient.execute(request);
        }
        catch (Exception e) {
            e.printStackTrace();
            logger.log("Failed to execute Azure Custom Vision request: " + e.getMessage());
        }
        return response;
    }

    private String getDownscopedToken(BoxDeveloperEditionAPIConnection api, String fileId) {
        String accessToken = null;
        try{
            String resource = "https://api.box.com/2.0/files/" + fileId;
            List<String> scopes = new ArrayList<>();
            scopes.add("item_read");

            ScopedToken token = api.getLowerScopedToken(scopes, resource);
            accessToken = token.getAccessToken();
        }
        catch (Exception e) {
            e.printStackTrace();
            logger.log("Failed to get downscoped token: " + e.getMessage());
        }
        return accessToken;
    }

    private BoxFile.Info uploadFile(BoxDeveloperEditionAPIConnection api, String fileId, String fileName, InputStream fileInputStream) {
        BoxFile.Info boxFileInfo = null;
        try{
            BoxFile boxFile = new BoxFile(api, fileId);
            String parentFolderId = boxFile.getInfo().getParent().getID();
            BoxFolder parentFolder = new BoxFolder(api, parentFolderId);
            String fileNameNoExtension = FilenameUtils.removeExtension(fileName);
            String fileExtension = FilenameUtils.getExtension(fileName);
            boxFileInfo = parentFolder.uploadFile(fileInputStream, fileNameNoExtension + "-thumbnail." + fileExtension);
        }
        catch (Exception e){
            e.printStackTrace();
            logger.log("Failed to upload file: " + e.getMessage());
        }
        return boxFileInfo;
    }

    private BoxDeveloperEditionAPIConnection getBoxConnection() {
        BoxDeveloperEditionAPIConnection api = null;
        try{
            // Read app config file from classpath. This is the file that was downloaded from generating the public/private keypair
            ClassLoader classLoader = getClass().getClassLoader();
            BoxConfig boxConfig = BoxConfig.readFrom(new FileReader(classLoader.getResource("box_config.json").getFile()));
            IAccessTokenCache accessTokenCache = new InMemoryLRUAccessTokenCache(MAX_CACHE_ENTRIES);

            // This is an example of getting a service account connection which can be used for things like
            // creating users, getting enterprise events, and other enterprise config
            api = BoxDeveloperEditionAPIConnection.getAppEnterpriseConnection(boxConfig, accessTokenCache);
        }
        catch (Exception e){
            e.printStackTrace();
            logger.log("Failed to get Box connection");
        }
        return api;
    }
}
