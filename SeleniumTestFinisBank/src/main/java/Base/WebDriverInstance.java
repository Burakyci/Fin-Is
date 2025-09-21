package Base;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.Objects;
import java.util.Properties;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

public class WebDriverInstance {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    public static WebDriver getDriver() {
        if (DRIVER.get() == null) {
            try {
                DRIVER.set(createDriver());
            } catch (IOException e) {
                throw new RuntimeException("Driver oluşturulamadı", e);
            }
        }
        return DRIVER.get();
    }

    private static WebDriver createDriver() throws IOException {
        Properties prop = loadProps();

        String browser = prop.getProperty("browser", "chrome").toLowerCase().trim();
        boolean headless = Boolean.parseBoolean(prop.getProperty("headless", "false"));

        WebDriver driver;
        switch (browser) {
            case "chrome": {
                ChromeOptions options = new ChromeOptions();
                if (headless) options.addArguments("--headless=new");
                driver = new ChromeDriver(options); // Selenium Manager doğru sürücüyü indirir
                break;
            }
            case "firefox": {
                FirefoxOptions options = new FirefoxOptions();
                if (headless) options.addArguments("-headless");
                driver = new FirefoxDriver(options);
                break;
            }
            default:
                throw new IllegalArgumentException("Desteklenmeyen browser: " + browser);
        }

        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        return driver;
    }

    private static Properties loadProps() throws IOException {
        Properties prop = new Properties();
        // config.properties'i src/test/resources veya src/main/resources altına koy
        try (InputStream in = WebDriverInstance.class
                .getClassLoader()
                .getResourceAsStream("config.properties")) {
            if (Objects.isNull(in)) {
                throw new IOException("config.properties bulunamadı (resources klasörüne koymalısın).");
            }
            prop.load(in);
        }
        return prop;
    }

    public static void cleanupDriver() {
        WebDriver d = DRIVER.get();
        if (d != null) {
            d.quit();
            DRIVER.remove();
        }
    }
}
