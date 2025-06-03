import static spark.Spark.*;
import com.google.gson.Gson;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        port(4567);
        Gson gson = new Gson();

        get("/search", (req, res) -> {
            String query = req.queryParams("q");
            String type = req.queryParams("type"); // "web" or "images"

            List<Result> results = new ArrayList<>();
            results.addAll(fetchFromGoogle(query, type));
            results.addAll(fetchFromBing(query, type));
            results.addAll(fetchFromYandex(query, type));
            results.addAll(fetchFromDuckDuckGo(query, type));
            results.addAll(fetchFromEcosia(query, type));
            results.addAll(fetchFromBrave(query, type));

            res.type("application/json");
            return gson.toJson(results);
        });
    }

    public static List<Result> fetchFromGoogle(String query, String type) {
        return Arrays.asList(new Result("https://google.com/example", "Google Result", "Example from Google", "Google"));
    }
    public static List<Result> fetchFromBing(String query, String type) {
        return Arrays.asList(new Result("https://bing.com/example", "Bing Result", "Example from Bing", "Bing"));
    }
    public static List<Result> fetchFromYandex(String query, String type) {
        return Arrays.asList(new Result("https://yandex.com/example", "Yandex Result", "Example from Yandex", "Yandex"));
    }
    public static List<Result> fetchFromDuckDuckGo(String query, String type) {
        return Arrays.asList(new Result("https://duckduckgo.com/example", "DuckDuckGo Result", "Example from DDG", "DuckDuckGo"));
    }
    public static List<Result> fetchFromEcosia(String query, String type) {
        return Arrays.asList(new Result("https://ecosia.org/example", "Ecosia Result", "Example from Ecosia", "Ecosia"));
    }
    public static List<Result> fetchFromBrave(String query, String type) {
        return Arrays.asList(new Result("https://search.brave.com/example", "Brave Result", "Example from Brave", "Brave"));
    }

    static class Result {
        String url;
        String title;
        String description;
        String source;

        Result(String url, String title, String description, String source) {
            this.url = url;
            this.title = title;
            this.description = description;
            this.source = source;
        }
    }
}
