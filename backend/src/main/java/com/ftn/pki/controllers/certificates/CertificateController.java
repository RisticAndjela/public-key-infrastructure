package com.ftn.pki.controllers.certificates;

import com.ftn.pki.dtos.certificates.*;
import com.ftn.pki.models.certificates.KEYSTOREDOWNLOADFORMAT;
import com.ftn.pki.services.certificates.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    @Autowired
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ca_user','admin_user')")
    public ResponseEntity<CreateCertifcateResponse> createCertificate(@RequestBody CreateCertificateRequest dto) {
        try {
            CreateCertifcateResponse certificate = certificateService.createCertificate(dto);
            return ResponseEntity.ok(certificate);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/ee")
    @PreAuthorize("hasRole('ee_user')")
    public ResponseEntity<byte[]> createEECertificate(@RequestBody CreateEECertificateRequest dto) {
        try {
            byte[] keystore = certificateService.createEECertificate(dto);
            String fileName = "certificate." + (dto.getKeyStoreFormat() == KEYSTOREDOWNLOADFORMAT.PKCS12 ? "p12" : "jks");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(keystore);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/applicable-ca")
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ca_user','ee_user','admin_user')")
    public ResponseEntity<Collection<SimpleCertificateResponse>> getAllCAForOrganization() {
        try {
            Collection<SimpleCertificateResponse> caCertificates = certificateService.findAllCAForMyOrganization();
            return ResponseEntity.ok(caCertificates);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ca_user','ee_user','admin_user')")
    public ResponseEntity<Collection<SimpleCertificateResponse>> getAll(){
        return ResponseEntity.ok(certificateService.findAllSimple());
    }
}
