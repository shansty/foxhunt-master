package baseEntities;

import core.BrowsersService;
import core.ReadProperties;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

public abstract class BaseTest {
    public BrowsersService browsersService;
    protected ReadProperties readProperties;
    protected final Logger logger = LogManager.getLogger(this);

    @BeforeTest
    public void setupTest() {
        readProperties = ReadProperties.getInstance();
    }

    @BeforeMethod
    public void startBrowser() {
        browsersService = new BrowsersService();
        logger.info("Browser opening");
    }

    @AfterMethod
    public void closeBrowser() {
        browsersService.getDriver().quit();
        browsersService = null;
        logger.info("Browser was closing");
    }
}
