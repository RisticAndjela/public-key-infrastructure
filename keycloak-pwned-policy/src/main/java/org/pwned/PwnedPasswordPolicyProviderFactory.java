package org.pwned;

import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.policy.PasswordPolicyProvider;
import org.keycloak.policy.PasswordPolicyProviderFactory;

public class PwnedPasswordPolicyProviderFactory implements PasswordPolicyProviderFactory {

    public static final String PROVIDER_ID = "pwned-password-policy";
    private static final int DEFAULT_MIN_LENGTH = 8;

    @Override
    public PasswordPolicyProvider create(KeycloakSession session) {
        return new PwnedPasswordPolicyProvider(session, DEFAULT_MIN_LENGTH);
    }

    @Override
    public void init(Config.Scope scope) { }

    @Override
    public void postInit(KeycloakSessionFactory factory) { }

    @Override
    public void close() { }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayName() {
        return "Simple Password Strength Policy";
    }

    @Override
    public String getConfigType() {
        return "int";
    }

    @Override
    public String getDefaultConfigValue() {
        return Integer.toString(DEFAULT_MIN_LENGTH);
    }

    @Override
    public boolean isMultiplSupported() {
        return false;
    }
}
