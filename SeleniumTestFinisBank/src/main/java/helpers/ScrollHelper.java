package helpers;

import Base.Hooks;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import java.io.IOException;

public class ScrollHelper {
    public void scrollOnElement(WebElement element) throws IOException {
        JavascriptExecutor js = (JavascriptExecutor) Hooks.getDriver();
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    }
}
