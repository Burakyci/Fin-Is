package Base;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Date;
import java.util.Properties;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BasePage {

    public String url;
    public Properties prop;
    public static String screenShotDestinationPath;

    public BasePage() throws IOException {
        prop = new Properties();
        FileInputStream data = new FileInputStream(
                Paths.get(System.getProperty("user.dir"), "src", "main", "java", "resources", "config.properties").toFile()
        );

        prop.load(data);
    }

    public static WebDriver getDriver() throws IOException {
        return WebDriverInstance.getDriver();
    }

    public String getUrl() throws IOException {
        url = prop.getProperty("url");
        return url;
    }

    /**
     * Güvenli screenshot alma. Dizin yoksa oluşturur. Driver null veya hata durumunda exception yerine loglar.
     * @param name optional name (kullanılmıyor ama çağrı rahatlığı için bırakıldı)
     */
    public static void takeSnapShot(String name) {
        try {
            WebDriver driver = getDriver();
            if (driver == null) {
                System.err.println("takeSnapShot: WebDriver null, screenshot alınamadı.");
                return;
            }

            // Dizin oluşturma (platform bağımsız)
            Path screenshotsDir = Paths.get(System.getProperty("user.dir"), "target", "screenshots");
            if (!Files.exists(screenshotsDir)) {
                Files.createDirectories(screenshotsDir);
            }

            // güvenli zaman formatı ve dosya yolu
            String destFile = screenshotsDir.resolve(timestamp() + ".png").toString();
            screenShotDestinationPath = destFile;

            File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            FileUtils.copyFile(srcFile, new File(destFile));
            System.out.println("Screenshot saved: " + destFile);
        } catch (IOException e) {
            System.err.println("takeSnapShot IOException: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("takeSnapShot unexpected error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static String timestamp() {
        // arada boşluk ya da ':' yok, cross-platform güvenli isim
        return new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
    }

    public static String getScreenshotDestinationPath() {
        return screenShotDestinationPath;
    }

    /**
     * safeSendKeys: sendKeys için null kontrolü, bekleme ve element temizleme içerir.
     * Statik olduğu için çağırırken BasePage.safeSendKeys(element, value, 10);
     */
    public static void safeSendKeys(WebElement element, String value, int timeoutSeconds) {
        try {
            WebDriver driver = getDriver();
            if (driver == null) {
                System.err.println("safeSendKeys: WebDriver null. sendKeys atılmadı.");
                return;
            }

            if (element == null) {
                System.err.println("safeSendKeys: WebElement null. sendKeys atılmadı.");
                return;
            }

            if (value == null) {
                System.err.println("safeSendKeys: gelen value null, empty string ile değiştiriliyor.");
                value = "";
            }

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
            try {
                wait.until(ExpectedConditions.visibilityOf(element));
                wait.until(ExpectedConditions.elementToBeClickable(element));
            } catch (TimeoutException te) {
                System.err.println("safeSendKeys: element görünür/etkileşilebilir olmadı, yine de sendKeys deneniyor.");
            }

            try {
                element.clear();
            } catch (Exception ignored) {}

            element.sendKeys(value);
        } catch (Exception e) {
            System.err.println("safeSendKeys unexpected error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
