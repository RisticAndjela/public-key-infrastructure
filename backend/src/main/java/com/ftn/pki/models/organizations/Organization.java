package com.ftn.pki.models.organizations;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "ORGANIZATIONS")
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String name;

    @Column(nullable = false)
    private String encryptedOrgKey;

    @Column(nullable = false)
    private String orgKeyIv;

}
