package pageObjects;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.IOException;

public class CreditApplicationPage extends BasePage {

    public WebDriver driver;

    // Locators
    public By loanAmountInput = By.cssSelector("input[placeholder='örnek: 100000']");
    public By loanTermInput = By.cssSelector("input[placeholder='örnek: 36']");

    public By calculateButton = By.xpath("//button[normalize-space(text())='🤖 AI Analiz Et']");
    public By applyButton = By.xpath("//button[contains(normalize-space(.), 'Krediyi Hesabıma Çek')]");

    public By monthlyPaymentResult = By.cssSelector("div[class*='statValueBlue']");
    public By decisionResult = By.cssSelector(".result .decision");
    public By creditScoreResult = By.cssSelector(".result .credit-score");
    public By loadingIndicator = By.cssSelector(".loading");
    public By riskFactors = By.cssSelector(".risk-factors");

    public CreditApplicationPage() throws IOException {
        super();
    }

    public WebElement getLoanAmountInput() throws IOException {
        this.driver = getDriver();
        return driver.findElement(loanAmountInput);
    }

    public WebElement getLoanTermInput() throws IOException {
        this.driver = getDriver();
        return driver.findElement(loanTermInput);
    }

    public WebElement getCalculateButton() throws IOException {
        this.driver = getDriver();
        return driver.findElement(calculateButton);
    }

    public WebElement getApplyButton() throws IOException {
        this.driver = getDriver();
        return driver.findElement(applyButton);
    }

    public WebElement getMonthlyPaymentResult() throws IOException {
        this.driver = getDriver();
        return driver.findElement(monthlyPaymentResult);
    }

    public WebElement getDecisionResult() throws IOException {
        this.driver = getDriver();
        return driver.findElement(decisionResult);
    }

    public WebElement getCreditScoreResult() throws IOException {
        this.driver = getDriver();
        return driver.findElement(creditScoreResult);
    }

    public WebElement getLoadingIndicator() throws IOException {
        this.driver = getDriver();
        return driver.findElement(loadingIndicator);
    }

    public WebElement getRiskFactors() throws IOException {
        this.driver = getDriver();
        return driver.findElement(riskFactors);
    }
}