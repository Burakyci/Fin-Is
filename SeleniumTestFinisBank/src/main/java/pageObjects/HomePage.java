package pageObjects;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.IOException;

public class HomePage extends BasePage {

    public WebDriver driver;

    public By welcomeTitle = By.cssSelector("h1");
    public By accountLink = By.linkText("Hesabım");
    public By creditApplicationLink = By.linkText("Kredi Başvurusu");
    public By logoutLink = By.linkText("Çıkış");
    public By accountNumber = By.cssSelector(".account-info h3");
    public By accountBalance = By.cssSelector(".account-info p");
    public By navigationMenu = By.cssSelector("nav");
    public By loginButton = By.linkText("Giriş Yap");


    public HomePage() throws IOException {
        super();
    }

    public WebElement getWelcomeTitle() throws IOException {
        this.driver = getDriver();
        return driver.findElement(welcomeTitle);
    }

    public WebElement getAccountLink() throws IOException {
        this.driver = getDriver();
        return driver.findElement(accountLink);
    }

    public WebElement getCreditApplicationLink() throws IOException {
        this.driver = getDriver();
        return driver.findElement(creditApplicationLink);
    }

    public WebElement getLogoutLink() throws IOException {
        this.driver = getDriver();
        return driver.findElement(logoutLink);
    }

    public WebElement getAccountNumber() throws IOException {
        this.driver = getDriver();
        return driver.findElement(accountNumber);
    }

    public WebElement getAccountBalance() throws IOException {
        this.driver = getDriver();
        return driver.findElement(accountBalance);
    }

    public WebElement getNavigationMenu() throws IOException {
        this.driver = getDriver();
        return driver.findElement(navigationMenu);
    }
    public WebElement getLoginButton() throws IOException {
        this.driver = getDriver();
        return driver.findElement(loginButton);
    }
}