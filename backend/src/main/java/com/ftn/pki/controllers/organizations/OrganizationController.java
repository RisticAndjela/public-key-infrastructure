package com.ftn.pki.controllers.organizations;

import com.ftn.pki.dto.ogranizations.OrganizationResponse;
import com.ftn.pki.services.organizations.OrganizationService;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {
    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping
    public ResponseEntity<Void> createOrganization(@RequestBody String organizationName) throws Exception {
        this.organizationService.registerOrganization(organizationName);
        return ResponseEntity.status(201).build();
    }

    @GetMapping
    public ResponseEntity<Collection<OrganizationResponse>> getAllOrganizations() {
        return ResponseEntity.ok(organizationService.findAllDTO());
    }
}
