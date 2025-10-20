package com.ftn.pki;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class PkiApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("MASTER_KEY", dotenv.get("MASTER_KEY"));
        System.setProperty("KEYCLOAK_URL", dotenv.get("KEYCLOAK_URL"));
        System.setProperty("KEYCLOAK_REALM", dotenv.get("KEYCLOAK_REALM"));
        System.setProperty("KEYCLOAK_CLIENT_ID", dotenv.get("KEYCLOAK_CLIENT_ID"));
        System.setProperty("KEYCLOAK_CLIENT_SECRET", dotenv.get("KEYCLOAK_CLIENT_SECRET"));

        SpringApplication.run(PkiApplication.class, args);
    }
}
