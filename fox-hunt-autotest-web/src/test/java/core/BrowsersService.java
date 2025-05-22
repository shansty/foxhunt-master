package core;

import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.bonigarcia.wdm.config.DriverManagerType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.safari.SafariDriver;

public class BrowsersService {

    private WebDriver driver;
    protected final Logger logger = LogManager.getLogger(this);
    private final static ReadProperties properties = ReadProperties.getInstance();

    public BrowsersService() {

        switch (properties.getBrowserName().toLowerCase()) {
            case "chrome":
                WebDriverManager.getInstance(DriverManagerType.CHROME).setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.setHeadless(properties.isHeadless());
                chromeOptions.addArguments("start-maximized");
                driver = new ChromeDriver(chromeOptions);
                break;


            case "firefox":
                WebDriverManager.getInstance(DriverManagerType.FIREFOX).setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.setHeadless(properties.isHeadless());
                driver = new FirefoxDriver(firefoxOptions);
                break;

            case "edge":
                WebDriverManager.getInstance(DriverManagerType.EDGE).setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.setHeadless(properties.isHeadless());
                driver = new EdgeDriver(edgeOptions);
                break;

            case "safari":
                WebDriverManager.getInstance(DriverManagerType.SAFARI).setup();
                driver = new SafariDriver();
                break;

            default:
                logger.info("Browser {} isn't supported", properties.getBrowserName());
        }
        logger.info("Create {} driver", properties.getBrowserName());
    }

    public WebDriver getDriver() {
        return driver;
    }
}
