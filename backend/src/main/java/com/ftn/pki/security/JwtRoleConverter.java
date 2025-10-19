package com.ftn.pki.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {

        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        Map<String, Object> pkiFrontend;
        if (resourceAccess != null) {
            Object pkiObj = resourceAccess.get("pki-frontend");
            if (pkiObj instanceof Map) {
                Map<?, ?> rawMap = (Map<?, ?>) pkiObj;
                java.util.HashMap<String, Object> tmp = new java.util.HashMap<>();
                for (Map.Entry<?, ?> e : rawMap.entrySet()) {
                    if (e.getKey() instanceof String) {
                        tmp.put((String) e.getKey(), e.getValue());
                    }
                }
                pkiFrontend = tmp;
            } else {
                pkiFrontend = java.util.Collections.emptyMap();
            }
        } else {
            pkiFrontend = java.util.Collections.emptyMap();
        }
        Object rolesObj = pkiFrontend.get("roles");
        Collection<?> rolesRaw = rolesObj instanceof Collection ? (Collection<?>) rolesObj : java.util.Collections.emptyList();
        Collection<String> roles = rolesRaw.stream().map(Object::toString).collect(Collectors.toList());

        Collection<GrantedAuthority> authorities = roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(Collectors.toList());
        AbstractAuthenticationToken authenticationToken = new JwtAuthenticationToken(jwt, authorities);
        return authenticationToken;
    }
}
