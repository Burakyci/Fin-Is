package pageObjects;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.IOException;

public class LoginPage extends BasePage {

    public WebDriver driver;

    public By emailInput = By.cssSelector("input[type='email']");
    public By passwordInput = By.cssSelector("input[type='password']");
    public By loginButton = By.cssSelector("button[type='submit']");
    public By errorMessage = By.cssSelector(".error-message");
    public By registerLink = By.linkText("Kayıt Ol");
    public By loginTitle = By.cssSelector("h2");
    public By loginForm = By.cssSelector("form");

    public LoginPage() throws IOException {
        super();
    }

    public WebElement getEmailInput() throws IOException {
        this.driver = getDriver();
        return driver.findElement(emailInput);
    }

    public WebElement getPasswordInput() throws IOException {
        this.driver = getDriver();
        return driver.findElement(passwordInput);
    }

    public WebElement getLoginButton() throws IOException {
        this.driver = getDriver();
        return driver.findElement(loginButton);
    }

    public WebElement getErrorMessage() throws IOException {
        this.driver = getDriver();
        return driver.findElement(errorMessage);
    }

    public WebElement getRegisterLink() throws IOException {
        this.driver = getDriver();
        return driver.findElement(registerLink);
    }

    public WebElement getLoginTitle() throws IOException {
        this.driver = getDriver();
        return driver.findElement(loginTitle);
    }

    public WebElement getLoginForm() throws IOException {
        this.driver = getDriver();
        return driver.findElement(loginForm);
    }
}