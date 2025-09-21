package test;

import Base.ExtentManager;
import Base.Hooks;
import helpers.ConfigReader;
import helpers.CreditCalculationUtil;
import helpers.ScrollHelper;
import helpers.WaitHelper;
import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;
import pageObjects.AccountPage;
import pageObjects.CreditApplicationPage;
import pageObjects.HomePage;

import java.io.IOException;

@Listeners(resources.Listeners.class)
public class CreditApplicationTest extends Hooks {

    public CreditApplicationTest() throws IOException {
        super();
    }

    @Test
    public void creditApplicationTest() throws IOException, InterruptedException {
        HomePage homePage = new HomePage();
        AccountPage accountPage = new AccountPage();
        WaitHelper waitHelper = new WaitHelper();
        ScrollHelper scrollHelper = new ScrollHelper();
        CreditApplicationPage creditApplicationPage = new CreditApplicationPage();

        int loanTerm = ConfigReader.getIntProperty("loanTerm");
        double loanAmount = ConfigReader.getDoubleProperty("loanAmount");
        WebDriver driver = Hooks.getDriver();

        LoginTest loginTest = new LoginTest();
        loginTest.testSuccessfulLogin();

        double currentBalance = Double.parseDouble(
                accountPage.getBalance()
                        .getText()
                        .replace(" TL", "")
                        .replace(".", "")
                        .replace(",", ".")
                        .trim()
        );
        System.out.println(currentBalance);

        Thread.sleep(888);
        homePage.getCreditApplicationLink().click();

        waitHelper.waitForElementVisibility(creditApplicationPage.loanAmountInput, 22);
        creditApplicationPage.getLoanAmountInput().clear();
        creditApplicationPage.getLoanAmountInput().sendKeys(String.valueOf(loanAmount));

        creditApplicationPage.getLoanTermInput().clear();
        creditApplicationPage.getLoanTermInput().sendKeys(String.valueOf(loanTerm));

        waitHelper.waitForElementVisibility(creditApplicationPage.calculateButton, 22);
        creditApplicationPage.getCalculateButton().click();

        waitHelper.waitForElementVisibility(creditApplicationPage.monthlyPaymentResult, 22);

        double actualPaymentResult = Double.parseDouble(
                creditApplicationPage.getMonthlyPaymentResult()
                        .getText()
                        .replace(" TL", "")
                        .replace(".", "")
                        .replace(",", ".")
                        .trim()
        );

        double expectedPaymentResult =
                CreditCalculationUtil.calculateMonthlyPaymentAsDouble(loanAmount, loanTerm);

        Thread.sleep(222);
        scrollHelper.scrollOnElement(creditApplicationPage.getApplyButton());
        waitHelper.waitForElementVisibility(creditApplicationPage.applyButton, 22);
        creditApplicationPage.getApplyButton().click();

        Thread.sleep(1111);
        Alert alert = driver.switchTo().alert();
        alert.accept();

        waitHelper.waitForElementVisibility(accountPage.balance, 22);

        double expectedBalance = currentBalance + loanAmount;
        double actualBalance = Double.parseDouble(
                accountPage.getBalance()
                        .getText()
                        .replace(" TL", "")
                        .replace(".", "")
                        .replace(",", ".")
                        .trim()
        );


        try {
            Assert.assertEquals(
                    actualPaymentResult, expectedPaymentResult, 0.01, "Aylık ödeme uyuşmuyor"
            );
            ExtentManager.pass(
                    "Aylık ödeme uyumlu. UI: " + actualPaymentResult + " | Beklenen: " + expectedPaymentResult
            );
            Assert.assertEquals(
                    actualBalance, expectedBalance, 0.01, "Bakiye uyuşmuyor"
            );
            ExtentManager.pass(
                    "Bakiye uyumlu. UI: " + actualBalance + " | Beklenen: " + expectedBalance
            );

        } catch (AssertionError e) {
            ExtentManager.fail("Hesaplama uyumsuzluğu: " + e.getMessage());
            throw e;
        }

        Thread.sleep(2222);
    }
}
