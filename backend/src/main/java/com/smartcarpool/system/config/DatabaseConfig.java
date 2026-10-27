package com.smartcarpool.system.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Profile("!test")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Value("${DB_URL:}")
    private String envDbUrl;

    @Value("${DATABASE_URL:}")
    private String envDatabaseUrl;

    @Value("${DB_USERNAME:}")
    private String envDbUsername;

    @Value("${DB_PASSWORD:}")
    private String envDbPassword;

    /**
     * Checks for a local .env file in backend/ or working directory and extracts key-value pairs.
     */
    private Map<String, String> loadDotenv() {
        Map<String, String> envMap = new HashMap<>();
        String[] potentialPaths = {".env", "backend/.env", "../backend/.env"};
        for (String p : potentialPaths) {
            File file = new File(p);
            if (file.exists() && file.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                            continue;
                        }
                        int idx = line.indexOf('=');
                        String key = line.substring(0, idx).trim();
                        String val = line.substring(idx + 1).trim();
                        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.substring(1, val.length() - 1);
                        }
                        envMap.putIfAbsent(key, val);
                    }
                    log.info("Loaded database environment settings from local env file: {}", file.getName());
                    break;
                } catch (Exception e) {
                    log.warn("Could not read .env file at {}: {}", p, e.getMessage());
                }
            }
        }
        return envMap;
    }

    private String resolveValue(String key, String envValue, String configuredValue, Map<String, String> dotenv) {
        String val = System.getenv(key);
        if (val != null && !val.isBlank()) return val;
        if (envValue != null && !envValue.isBlank()) return envValue;
        val = dotenv.get(key);
        if (val != null && !val.isBlank()) return val;
        if (configuredValue != null && !configuredValue.isBlank()) return configuredValue;
        return "";
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        Map<String, String> dotenv = loadDotenv();

        String dbUrl = resolveValue("DB_URL", envDbUrl, "", dotenv);
        if (dbUrl.isBlank()) {
            dbUrl = resolveValue("DATABASE_URL", envDatabaseUrl, "", dotenv);
        }
        if (dbUrl.isBlank()) {
            dbUrl = configuredUrl;
        }

        String username = resolveValue("DB_USERNAME", envDbUsername, configuredUsername, dotenv);
        if (username.isBlank()) {
            username = "root";
        }

        String password = resolveValue("DB_PASSWORD", envDbPassword, configuredPassword, dotenv);

        // Handle mysql:// URI format from hosted cloud MySQL providers
        if (dbUrl.startsWith("mysql://")) {
            try {
                log.info("Detected mysql:// URI format from environment. Parsing hosted MySQL connection parameters...");
                URI uri = new URI(dbUrl);
                String userInfo = uri.getUserInfo();

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 3306;
                String path = uri.getPath(); // e.g. /smart_carpool

                String jdbcUrl = "jdbc:mysql://" + host + ":" + port + path;
                if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
                    jdbcUrl += "?" + uri.getQuery();
                } else {
                    jdbcUrl += "?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC";
                }

                log.info("Configured MySQL connection to host: {}, database: {}", host, path);
                return createHikariDataSource(jdbcUrl, username, password, "com.mysql.cj.jdbc.Driver");
            } catch (Exception e) {
                log.error("Failed to parse mysql:// URI format, falling back to configured settings", e);
            }
        }

        // If a PostgreSQL URL is detected, issue a warning because system has migrated to MySQL
        if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://") || dbUrl.startsWith("jdbc:postgresql://")) {
            log.warn("PostgreSQL connection string detected, but Smart Carpool has migrated to MySQL! Please provide a MySQL JDBC URL (jdbc:mysql://...).");
        }

        // Standard MySQL JDBC URL (jdbc:mysql://...)
        if (dbUrl.startsWith("jdbc:mysql:")) {
            log.info("Testing connection to MySQL database via JDBC URL: {}", dbUrl.split("\\?")[0]);
            try {
                DriverManager.setLoginTimeout(3);
                try (Connection conn = DriverManager.getConnection(dbUrl, username, password)) {
                    log.info("Successfully connected to MySQL database: {}", dbUrl.split("\\?")[0]);
                }
                return createHikariDataSource(dbUrl, username, password, "com.mysql.cj.jdbc.Driver");
            } catch (Exception e) {
                log.warn("Could not connect to MySQL server at {}: {}. Falling back to in-memory H2 database in MySQL compatibility mode so the application runs smoothly without error.", dbUrl.split("\\?")[0], e.getMessage());
                return createFallbackH2DataSource();
            }
        }

        // Other JDBC URL (e.g. test H2)
        if (!dbUrl.isBlank() && !dbUrl.contains("postgresql")) {
            return createHikariDataSource(dbUrl, username, password, null);
        }

        // Default in-memory H2 fallback in MySQL compatibility mode for development
        log.warn("No external MySQL database connection URL found. Falling back to in-memory H2 database in MySQL compatibility mode for local development.");
        return createFallbackH2DataSource();
    }

    private HikariDataSource createFallbackH2DataSource() {
        return createHikariDataSource(
                "jdbc:h2:mem:smartcarpool;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL;DATABASE_TO_LOWER=TRUE",
                "sa",
                "",
                "org.h2.Driver"
        );
    }

    private HikariDataSource createHikariDataSource(String jdbcUrl, String username, String password, String driverClassName) {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        ds.setUsername(username);
        ds.setPassword(password);
        if (driverClassName != null && !driverClassName.isBlank()) {
            ds.setDriverClassName(driverClassName);
        }
        ds.setMaximumPoolSize(10);
        ds.setMinimumIdle(2);
        ds.setConnectionTimeout(20000);
        ds.setIdleTimeout(300000);
        ds.setPoolName("SmartCarpoolHikariPool");
        return ds;
    }
}
