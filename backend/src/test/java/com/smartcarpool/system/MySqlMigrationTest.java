package com.smartcarpool.system;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class MySqlMigrationTest {

    @Test
    @DisplayName("Verify V1__init_schema.sql parses and executes cleanly under MySQL compatibility mode")
    void testFlywayMigrationExecution() {
        assertDoesNotThrow(() -> {
            DataSource dataSource = DataSourceBuilder.create()
                    .driverClassName("org.h2.Driver")
                    .url("jdbc:h2:mem:flywaytest;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE")
                    .username("sa")
                    .password("")
                    .build();

            Flyway flyway = Flyway.configure()
                    .dataSource(dataSource)
                    .locations("classpath:db/migration")
                    .baselineOnMigrate(true)
                    .load();

            flyway.migrate();
        });
    }
}
