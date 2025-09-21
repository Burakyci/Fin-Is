package resources;

import java.io.IOException;


import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;
import Base.BasePage;
import Base.ExtentManager;

public class Listeners extends BasePage implements ITestListener {

    public Listeners() throws IOException {
        super();
    }

    public synchronized void onStart(ITestContext context) {
        System.out.println(context.getAllTestMethods()[0] + " has started running");
        ExtentManager.getReport();
        ExtentManager.createTest(context.getName(), context.getName());

    }

    public synchronized void onTestFailure(ITestResult result) {
        ExtentManager.getTest().fail(result.getThrowable());
        try {
            System.out.println("Test failed: " + result.getName());
            takeSnapShot(result.getMethod().getMethodName());
            ExtentManager.attachImage();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public synchronized void onFinish(ITestContext context) {
        System.out.println(context.getAllTestMethods()[0] + " has started running");
        try {
            ExtentManager.flushReport();
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

}