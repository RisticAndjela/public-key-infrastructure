package org.pwned;

import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.policy.PasswordPolicyProvider;
import org.keycloak.policy.PolicyError;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class PwnedPasswordPolicyProvider implements PasswordPolicyProvider {

    private final int minLength;
    private final KeycloakSession session;

    private static final Pattern UPPERCASE_PATTERN = Pattern.compile(".*[A-Z].*");
    private static final Pattern DIGIT_PATTERN = Pattern.compile(".*\\d.*");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile(".*[^A-Za-z0-9].*");

    public PwnedPasswordPolicyProvider(KeycloakSession session, int minLength) {
        this.session = session;
        this.minLength = minLength;
    }

    @Override
    public void close() { }

    @Override
    public PolicyError validate(RealmModel realm, UserModel user, String password) {
        if (password == null || password.isEmpty()) {
            return new PolicyError("Password cannot be empty.");
        }

        if (password.length() < minLength) {
            return new PolicyError("Password must be at least " + minLength + " characters long.");
        }

        if (!UPPERCASE_PATTERN.matcher(password).matches()) {
            return new PolicyError("Password must contain at least one uppercase letter (A-Z).");
        }

        if (!DIGIT_PATTERN.matcher(password).matches()) {
            return new PolicyError("Password must contain at least one digit (0-9).");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).matches()) {
            return new PolicyError("Password must contain at least one special character (e.g. !@#$%^&*).");
        }

        List<String> weakPasswords = Arrays.asList("password", "123456", "qwerty", "admin", "letmein");
        if (weakPasswords.contains(password.toLowerCase())) {
            return new PolicyError("This password is too common. Choose a stronger one.");
        }

        return null;
    }

    @Override
    public PolicyError validate(String password, String realmId) {
        return validate(null, null, password);
    }

    @Override
    public Object parseConfig(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 8;
        }
    }
}
